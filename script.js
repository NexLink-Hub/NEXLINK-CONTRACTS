// Set current date
document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Generate unique contract reference number
function generateContractReference() {
    const now = new Date();
    
    // Year (last 2 digits)
    const year = now.getFullYear().toString().slice(-2);
    
    // Month (01-12)
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    // Day (01-31)
    const day = String(now.getDate()).padStart(2, '0');
    
    // Hour + Minute for uniqueness (0000-2359)
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    
    // Random 4-digit number for extra uniqueness
    const random = String(Math.floor(1000 + Math.random() * 9000));
    
    // Format: GL-YYMMDD-HHMM-XXXX
    // Example: GL-251027-1430-5847
    return `${year}${month}${day}-${hour}${minute}-${random}`;
}

// Set the contract reference
document.getElementById('contract-number').textContent = generateContractReference();

document.getElementById('sendBtn').addEventListener('click', function() {
    const button = this;
    const originalText = button.innerHTML;
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Hide any previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Get form data
    const formData = {
        clientName: document.getElementById('client-name').value,
        clientEmail: document.getElementById('client-email').value,
        clientContact: document.getElementById('client-contact').value,
        setupCost: document.getElementById('setup-cost').value,
        monthlyCost: document.getElementById('monthly-cost').value
    };
    
    // Validate required fields
    if (!formData.clientName || !formData.clientEmail || !formData.clientContact) {
        errorMessage.textContent = "❌ Please fill in all required fields (marked with *)";
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.clientEmail)) {
        errorMessage.textContent = "❌ Please enter a valid email address";
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    // Show loading state
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span> Generating PDF...';
    
    // Create a copy of the content for PDF generation
    const element = document.getElementById('contract-content');
    
    // PDF options with better configuration
    const options = {
        margin: [10, 10, 10, 10],
        filename: `GlowLink_Contract_${formData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { 
            type: 'jpeg', 
            quality: 0.98 
        },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            allowTaint: false,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy'] 
        }
    };
    
    // Generate PDF
    html2pdf().set(options).from(element).save().then(() => {
        // Show success message
        successMessage.style.display = 'block';
        
        // Reset button
        button.disabled = false;
        button.innerHTML = originalText;
        
        // Scroll to show the message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    }).catch(error => {
        console.error('PDF generation failed:', error);
        errorMessage.textContent = "❌ Failed to generate PDF. Please try again or contact support.";
        errorMessage.style.display = 'block';
        button.disabled = false;
        button.innerHTML = originalText;
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// Add input formatting for better UX
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            this.style.backgroundColor = '#f9fafb';
            this.style.borderColor = '#d1d5db';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.backgroundColor = '#ffffff';
    });
});