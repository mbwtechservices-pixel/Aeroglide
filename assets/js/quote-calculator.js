// Quote Calculator JavaScript
(function() {
    'use strict';

    // Construction package rates per sqft
    const CONSTRUCTION_RATES = {
        'silver': 1800,
        'gold': 2400,
        'platinum': 3200
    };

    // Interior add-on rates per sqft
    const INTERIOR_RATES = {
        'basic': 1200,
        'premium': 1800,
        'luxury': 2500
    };

    // Compound wall rates based on plot size
    const COMPOUND_WALL_RATES = {
        'up-to-1200': 300000,
        '1200-2400': 450000,
        'above-2400': 600000
    };

    // Construction area sizes
    const CONSTRUCTION_AREAS = {
        '1200': { label: '30 x 40 (1200 Sqft)', sqft: 1200 },
        '2400': { label: '60 x 40 (2400 Sqft)', sqft: 2400 },
        '3200': { label: '80 x 40 (3200 Sqft)', sqft: 3200 }
    };

    // Selected addons
    let selectedInteriorAddon = null;
    let selectedCompoundAddon = null;
    
    // Customer info (stored from step 1)
    let customerInfo = {
        name: '',
        email: '',
        phone: ''
    };

    // Initialize the quote calculator
    function initQuoteCalculator() {
        const floatBtn = document.querySelector('.quote-float-btn');
        const modalOverlay = document.querySelector('.quote-modal-overlay');
        const closeBtn = document.querySelector('.quote-modal-close');
        const constructionAreaSelect = document.getElementById('construction-area');
        const constructionVariantSelect = document.getElementById('construction-variant');
        const form = document.getElementById('quote-calculator-form');
        const contactForm = document.getElementById('quote-contact-form');
        const nextBtn = document.getElementById('contact-next-btn');

        // Open modal - show step 1 (contact form)
        if (floatBtn) {
            floatBtn.addEventListener('click', function() {
                resetModal();
                showStep(1);
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
        }

        // Close summary modal
        const summaryCloseBtn = document.querySelector('.summary-modal-close');
        const summaryModal = document.querySelector('.quote-summary-modal');
        if (summaryCloseBtn) {
            summaryCloseBtn.addEventListener('click', function() {
                if (summaryModal) {
                    summaryModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
        if (summaryModal) {
            summaryModal.addEventListener('click', function(e) {
                if (e.target === summaryModal) {
                    summaryModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Handle contact form submission (Step 1)
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (validateContactForm()) {
                    // Store customer info
                    customerInfo.name = document.getElementById('contact-name').value.trim();
                    customerInfo.email = document.getElementById('contact-email').value.trim();
                    customerInfo.phone = document.getElementById('contact-phone').value.trim();
                    // Move to step 2
                    showStep(2);
                }
            });
        }

        // Handle next button click
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (validateContactForm()) {
                    customerInfo.name = document.getElementById('contact-name').value.trim();
                    customerInfo.email = document.getElementById('contact-email').value.trim();
                    customerInfo.phone = document.getElementById('contact-phone').value.trim();
                    showStep(2);
                }
            });
        }

        // Handle floors field
        const floorsSelect = document.getElementById('number-of-floors');
        if (floorsSelect) {
            floorsSelect.addEventListener('change', function() {
                calculateCost();
            });
        }

        // Calculate cost on area change
        if (constructionAreaSelect) {
            constructionAreaSelect.addEventListener('change', function() {
                updateAreaDisplay();
                calculateCost();
            });
        }

        // Show material specs and calculate cost on variant change
        if (constructionVariantSelect) {
            constructionVariantSelect.addEventListener('change', function() {
                showMaterialSpecs(this.value);
                calculateCost();
                setTimeout(function() {
                    calculateCost();
                }, 50);
            });
        }

        // Handle addon select buttons (desktop)
        document.querySelectorAll('.addon-select-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const addonType = this.getAttribute('data-addon');
                const type = this.getAttribute('data-type');
                const rate = this.getAttribute('data-rate');

                if (addonType === 'interior') {
                    toggleInteriorAddon(this, type, rate);
                } else if (addonType === 'compound') {
                    toggleCompoundAddon(this, type, rate);
                }
                calculateCost();
            });
        });

        // Handle checkbox for interior addon
        const interiorCheckbox = document.getElementById('interior-addon-checkbox');
        const interiorMobileSelect = document.getElementById('interior-addon-mobile');
        if (interiorCheckbox && interiorMobileSelect) {
            interiorCheckbox.addEventListener('change', function() {
                interiorMobileSelect.disabled = !this.checked;
                if (!this.checked) {
                    interiorMobileSelect.value = '';
                    selectedInteriorAddon = null;
                    document.getElementById('interior-addon-selected').value = '';
                    document.getElementById('interior-addon-type').value = '';
                    document.getElementById('interior-addon-rate').value = '';
                    document.querySelectorAll('.addon-select-btn[data-addon="interior"]').forEach(btn => {
                        btn.classList.remove('selected');
                        btn.textContent = 'Select';
                    });
                    calculateCost();
                }
            });
        }

        // Handle mobile dropdowns for addons
        if (interiorMobileSelect) {
            interiorMobileSelect.addEventListener('change', function() {
                if (this.value) {
                    const [type, rate] = this.value.split(':');
                    selectedInteriorAddon = { type: type, rate: parseFloat(rate) };
                    document.getElementById('interior-addon-selected').value = 'yes';
                    document.getElementById('interior-addon-type').value = type;
                    document.getElementById('interior-addon-rate').value = rate;
                    const desktopBtn = document.querySelector(`.addon-select-btn[data-addon="interior"][data-type="${type}"]`);
                    if (desktopBtn) {
                        document.querySelectorAll('.addon-select-btn[data-addon="interior"]').forEach(btn => {
                            btn.classList.remove('selected');
                            btn.textContent = 'Select';
                        });
                        desktopBtn.classList.add('selected');
                        desktopBtn.textContent = 'Selected ✓';
                    }
                    if (interiorCheckbox) {
                        interiorCheckbox.checked = true;
                    }
                } else {
                    selectedInteriorAddon = null;
                    document.getElementById('interior-addon-selected').value = '';
                    document.getElementById('interior-addon-type').value = '';
                    document.getElementById('interior-addon-rate').value = '';
                    document.querySelectorAll('.addon-select-btn[data-addon="interior"]').forEach(btn => {
                        btn.classList.remove('selected');
                        btn.textContent = 'Select';
                    });
                }
                calculateCost();
            });
        }

        // Handle checkbox for compound wall addon
        const compoundCheckbox = document.getElementById('compound-addon-checkbox');
        const compoundMobileSelect = document.getElementById('compound-addon-mobile');
        if (compoundCheckbox && compoundMobileSelect) {
            compoundCheckbox.addEventListener('change', function() {
                compoundMobileSelect.disabled = !this.checked;
                if (!this.checked) {
                    compoundMobileSelect.value = '';
                    selectedCompoundAddon = null;
                    document.getElementById('compound-addon-selected').value = '';
                    document.getElementById('compound-addon-type').value = '';
                    document.getElementById('compound-addon-rate').value = '';
                    document.querySelectorAll('.addon-select-btn[data-addon="compound"]').forEach(btn => {
                        btn.classList.remove('selected');
                        btn.textContent = 'Select';
                    });
                    calculateCost();
                }
            });
        }

        // Handle mobile dropdowns for compound wall
        if (compoundMobileSelect) {
            compoundMobileSelect.addEventListener('change', function() {
                if (this.value) {
                    const [type, rate] = this.value.split(':');
                    selectedCompoundAddon = { type: type, rate: parseFloat(rate) };
                    document.getElementById('compound-addon-selected').value = 'yes';
                    document.getElementById('compound-addon-type').value = type;
                    document.getElementById('compound-addon-rate').value = rate;
                    const desktopBtn = document.querySelector(`.addon-select-btn[data-addon="compound"][data-type="${type}"]`);
                    if (desktopBtn) {
                        document.querySelectorAll('.addon-select-btn[data-addon="compound"]').forEach(btn => {
                            btn.classList.remove('selected');
                            btn.textContent = 'Select';
                        });
                        desktopBtn.classList.add('selected');
                        desktopBtn.textContent = 'Selected ✓';
                    }
                    if (compoundCheckbox) {
                        compoundCheckbox.checked = true;
                    }
                } else {
                    selectedCompoundAddon = null;
                    document.getElementById('compound-addon-selected').value = '';
                    document.getElementById('compound-addon-type').value = '';
                    document.getElementById('compound-addon-rate').value = '';
                    document.querySelectorAll('.addon-select-btn[data-addon="compound"]').forEach(btn => {
                        btn.classList.remove('selected');
                        btn.textContent = 'Select';
                    });
                }
                calculateCost();
            });
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }

        // Handle built-up-area input field (for PHP files)
        const builtUpAreaInput = document.getElementById('built-up-area');
        if (builtUpAreaInput) {
            builtUpAreaInput.addEventListener('input', calculateCost);
            builtUpAreaInput.addEventListener('change', calculateCost);
        }

        // Calculate on any change to ensure updates
        if (constructionAreaSelect) {
            constructionAreaSelect.addEventListener('input', calculateCost);
        }
        if (constructionVariantSelect) {
            constructionVariantSelect.addEventListener('input', calculateCost);
        }

        // Initial calculation
        calculateCost();
        
        // Ensure step 1 is visible and step 2 is hidden on initialization
        const step1 = document.getElementById('quote-step-1');
        const step2 = document.getElementById('quote-step-2');
        if (step1) {
            step1.classList.add('active');
            step1.style.display = 'block';
            step1.style.visibility = 'visible';
            step1.style.opacity = '1';
        }
        if (step2) {
            step2.classList.remove('active');
            step2.style.display = 'none';
            step2.style.visibility = 'hidden';
            step2.style.opacity = '0';
        }
    }

    // Show step function
    function showStep(step) {
        const step1 = document.getElementById('quote-step-1');
        const step2 = document.getElementById('quote-step-2');
        const modalHeader = document.querySelector('.quote-modal-header h3');
        
        if (step === 1) {
            if (step1) {
                step1.classList.add('active');
                step1.style.display = 'block';
                step1.style.visibility = 'visible';
                step1.style.opacity = '1';
            }
            if (step2) {
                step2.classList.remove('active');
                step2.style.display = 'none';
                step2.style.visibility = 'hidden';
                step2.style.opacity = '0';
            }
            if (modalHeader) modalHeader.textContent = 'Get Your Quote - Step 1';
        } else if (step === 2) {
            if (step1) {
                step1.classList.remove('active');
                step1.style.display = 'none';
                step1.style.visibility = 'hidden';
                step1.style.opacity = '0';
            }
            if (step2) {
                step2.classList.add('active');
                step2.style.display = 'block';
                step2.style.visibility = 'visible';
                step2.style.opacity = '1';
            }
            if (modalHeader) modalHeader.textContent = 'Construction Calculator - Step 2';
            // Pre-fill customer info in hidden fields
            const nameField = document.getElementById('customer-name');
            const emailField = document.getElementById('customer-email');
            const phoneField = document.getElementById('customer-phone');
            if (nameField) nameField.value = customerInfo.name;
            if (emailField) emailField.value = customerInfo.email;
            if (phoneField) phoneField.value = customerInfo.phone;
        }
    }

    // Reset modal
    function resetModal() {
        customerInfo = { name: '', email: '', phone: '' };
        selectedInteriorAddon = null;
        selectedCompoundAddon = null;
        const form = document.getElementById('quote-calculator-form');
        const contactForm = document.getElementById('quote-contact-form');
        if (form) form.reset();
        if (contactForm) contactForm.reset();
        // Reset all addon buttons
        document.querySelectorAll('.addon-select-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.textContent = 'Select';
        });
        // Reset checkboxes
        const interiorCheckbox = document.getElementById('interior-addon-checkbox');
        const compoundCheckbox = document.getElementById('compound-addon-checkbox');
        if (interiorCheckbox) interiorCheckbox.checked = false;
        if (compoundCheckbox) compoundCheckbox.checked = false;
        // Reset mobile selects
        const interiorMobile = document.getElementById('interior-addon-mobile');
        const compoundMobile = document.getElementById('compound-addon-mobile');
        if (interiorMobile) {
            interiorMobile.value = '';
            interiorMobile.disabled = true;
        }
        if (compoundMobile) {
            compoundMobile.value = '';
            compoundMobile.disabled = true;
        }
        // Hide material specs
        const specsContainer = document.getElementById('material-specs-container');
        if (specsContainer) specsContainer.style.display = 'none';
        // Ensure step 1 is visible and step 2 is hidden
        const step1 = document.getElementById('quote-step-1');
        const step2 = document.getElementById('quote-step-2');
        if (step1) {
            step1.classList.add('active');
            step1.style.display = 'block';
            step1.style.visibility = 'visible';
            step1.style.opacity = '1';
        }
        if (step2) {
            step2.classList.remove('active');
            step2.style.display = 'none';
            step2.style.visibility = 'hidden';
            step2.style.opacity = '0';
        }
    }

    // Validate contact form
    function validateContactForm() {
        let isValid = true;
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();

        // Clear previous errors
        document.querySelectorAll('.quote-error').forEach(err => {
            err.classList.remove('show');
            err.textContent = '';
        });

        // Validate name
        if (name.length < 2) {
            showError('contact-name-error', 'Please enter a valid name');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('contact-email-error', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            showError('contact-phone-error', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        return isValid;
    }

    // Update area display
    function updateAreaDisplay() {
        const areaSelect = document.getElementById('construction-area');
        const areaDisplay = document.getElementById('construction-area-display');
        
        if (areaSelect && areaDisplay) {
            const selectedValue = areaSelect.value;
            if (selectedValue && CONSTRUCTION_AREAS[selectedValue]) {
                areaDisplay.textContent = CONSTRUCTION_AREAS[selectedValue].label;
            } else {
                areaDisplay.textContent = '-';
            }
        }
    }

    // Show material specifications table based on selected variant
    function showMaterialSpecs(variant) {
        const specsContainer = document.getElementById('material-specs-container');
        const specsTable = document.getElementById('material-specs-table');
        
        if (!variant) {
            if (specsContainer) specsContainer.style.display = 'none';
            return;
        }
        
        if (specsContainer && specsTable) {
            specsContainer.style.display = 'block';
            
            // Highlight the selected variant column
            const headerCells = specsTable.querySelectorAll('thead th');
            const bodyRows = specsTable.querySelectorAll('tbody tr');
            
            // Reset all columns
            headerCells.forEach((th, index) => {
                if (index > 0) {
                    th.style.backgroundColor = '';
                    th.style.color = '';
                }
            });
            
            bodyRows.forEach(row => {
                row.querySelectorAll('td').forEach((td, index) => {
                    if (index > 0) {
                        td.style.backgroundColor = '';
                        td.style.fontWeight = '';
                    }
                });
            });
            
            // Highlight selected variant column
            let columnIndex = 0;
            if (variant === 'silver') columnIndex = 1;
            else if (variant === 'gold') columnIndex = 2;
            else if (variant === 'platinum') columnIndex = 3;
            
            if (columnIndex > 0 && headerCells[columnIndex]) {
                headerCells[columnIndex].style.backgroundColor = '#D1B06B';
                headerCells[columnIndex].style.color = '#fff';
                
                bodyRows.forEach(row => {
                    const cell = row.querySelectorAll('td')[columnIndex];
                    if (cell) {
                        cell.style.backgroundColor = '#fff8e1';
                        cell.style.fontWeight = '600';
                    }
                });
            }
        } else if (specsContainer) {
            specsContainer.style.display = 'none';
        }
    }

    // Toggle interior addon selection
    function toggleInteriorAddon(button, type, rate) {
        document.querySelectorAll('.addon-select-btn[data-addon="interior"]').forEach(btn => {
            btn.classList.remove('selected');
            btn.textContent = 'Select';
        });

        const interiorMobile = document.getElementById('interior-addon-mobile');
        const interiorCheckbox = document.getElementById('interior-addon-checkbox');
        
        if (selectedInteriorAddon && selectedInteriorAddon.type === type) {
            selectedInteriorAddon = null;
            document.getElementById('interior-addon-selected').value = '';
            document.getElementById('interior-addon-type').value = '';
            document.getElementById('interior-addon-rate').value = '';
            if (interiorMobile) {
                interiorMobile.value = '';
                interiorMobile.disabled = true;
            }
            if (interiorCheckbox) {
                interiorCheckbox.checked = false;
            }
        } else {
            selectedInteriorAddon = { type: type, rate: parseFloat(rate) };
            button.classList.add('selected');
            button.textContent = 'Selected ✓';
            document.getElementById('interior-addon-selected').value = 'yes';
            document.getElementById('interior-addon-type').value = type;
            document.getElementById('interior-addon-rate').value = rate;
            if (interiorMobile) {
                interiorMobile.value = `${type}:${rate}`;
                interiorMobile.disabled = false;
            }
            if (interiorCheckbox) {
                interiorCheckbox.checked = true;
            }
        }
    }

    // Toggle compound wall addon selection
    function toggleCompoundAddon(button, type, rate) {
        document.querySelectorAll('.addon-select-btn[data-addon="compound"]').forEach(btn => {
            btn.classList.remove('selected');
            btn.textContent = 'Select';
        });

        const compoundMobile = document.getElementById('compound-addon-mobile');
        const compoundCheckbox = document.getElementById('compound-addon-checkbox');
        
        if (selectedCompoundAddon && selectedCompoundAddon.type === type) {
            selectedCompoundAddon = null;
            document.getElementById('compound-addon-selected').value = '';
            document.getElementById('compound-addon-type').value = '';
            document.getElementById('compound-addon-rate').value = '';
            if (compoundMobile) {
                compoundMobile.value = '';
                compoundMobile.disabled = true;
            }
            if (compoundCheckbox) {
                compoundCheckbox.checked = false;
            }
        } else {
            selectedCompoundAddon = { type: type, rate: parseFloat(rate) };
            button.classList.add('selected');
            button.textContent = 'Selected ✓';
            document.getElementById('compound-addon-selected').value = 'yes';
            document.getElementById('compound-addon-type').value = type;
            document.getElementById('compound-addon-rate').value = rate;
            if (compoundMobile) {
                compoundMobile.value = `${type}:${rate}`;
                compoundMobile.disabled = false;
            }
            if (compoundCheckbox) {
                compoundCheckbox.checked = true;
            }
        }
    }

    // Calculate total cost
    function calculateCost() {
        const constructionAreaEl = document.getElementById('construction-area');
        const builtUpAreaEl = document.getElementById('built-up-area');
        const constructionVariantEl = document.getElementById('construction-variant');
        const floorsEl = document.getElementById('number-of-floors');

        if (!constructionVariantEl) {
            return;
        }

        const constructionVariant = constructionVariantEl.value;
        
        let floorsMultiplier = 1;
        if (floorsEl && floorsEl.value) {
            const floorsValue = floorsEl.value;
            if (floorsValue === 'G') {
                floorsMultiplier = 1;
            } else if (floorsValue.startsWith('G+')) {
                const floorNumber = parseInt(floorsValue.replace('G+', ''));
                floorsMultiplier = floorNumber + 1;
            }
        }

        let constructionArea = 0;
        
        if (constructionAreaEl) {
            const constructionAreaValue = constructionAreaEl.value;
            if (constructionAreaValue && CONSTRUCTION_AREAS[constructionAreaValue]) {
                constructionArea = CONSTRUCTION_AREAS[constructionAreaValue].sqft;
            } else {
                updateCostDisplay(0, 0, 0, 0);
                return;
            }
        } else if (builtUpAreaEl) {
            const builtUpAreaValue = parseFloat(builtUpAreaEl.value);
            if (builtUpAreaValue && builtUpAreaValue > 0) {
                constructionArea = builtUpAreaValue;
            } else {
                updateCostDisplay(0, 0, 0, 0);
                return;
            }
        } else {
            updateCostDisplay(0, 0, 0, 0);
            return;
        }

        const totalArea = constructionArea * floorsMultiplier;
        let constructionCost = 0;
        let interiorCost = 0;
        let compoundWallCost = 0;

        if (totalArea > 0 && constructionVariant && CONSTRUCTION_RATES[constructionVariant]) {
            constructionCost = totalArea * CONSTRUCTION_RATES[constructionVariant];
        }

        if (selectedInteriorAddon && totalArea > 0) {
            interiorCost = totalArea * selectedInteriorAddon.rate;
        }

        if (selectedCompoundAddon) {
            compoundWallCost = selectedCompoundAddon.rate;
        }

        const totalCost = constructionCost + interiorCost + compoundWallCost;
        updateCostDisplay(constructionCost, interiorCost, compoundWallCost, totalCost);
        updateAreaDisplay();
    }

    // Update cost display (for real-time calculation in step 2)
    function updateCostDisplay(constructionCost, interiorCost, compoundWallCost, totalCost) {
        const constructionDisplay = document.getElementById('construction-cost-display');
        const interiorDisplay = document.getElementById('interior-cost-display');
        const compoundWallDisplay = document.getElementById('compound-wall-cost-display');
        const totalDisplay = document.getElementById('total-cost-display');

        if (constructionDisplay) {
            constructionDisplay.textContent = formatCurrency(constructionCost);
        }

        if (interiorDisplay) {
            const interiorItem = document.getElementById('interior-cost-item');
            if (interiorCost > 0) {
                interiorDisplay.textContent = formatCurrency(interiorCost);
                if (interiorItem) {
                    interiorItem.style.display = 'flex';
                }
            } else {
                if (interiorItem) {
                    interiorItem.style.display = 'none';
                }
            }
        }

        if (compoundWallDisplay) {
            const compoundWallItem = document.getElementById('compound-wall-cost-item');
            if (compoundWallCost > 0) {
                compoundWallDisplay.textContent = formatCurrency(compoundWallCost);
                if (compoundWallItem) {
                    compoundWallItem.style.display = 'flex';
                }
            } else {
                if (compoundWallItem) {
                    compoundWallItem.style.display = 'none';
                }
            }
        }

        if (totalDisplay) {
            totalDisplay.textContent = formatCurrency(totalCost);
        }
    }

    // Format currency
    function formatCurrency(amount) {
        if (amount === 0) return '₹0';
        return '₹' + amount.toLocaleString('en-IN');
    }

    // Close modal
    function closeModal() {
        const modalOverlay = document.querySelector('.quote-modal-overlay');
        const summaryModal = document.querySelector('.quote-summary-modal');
        
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            resetModal();
            showStep(1);
        }
        
        if (summaryModal) {
            summaryModal.classList.remove('active');
        }
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('.quote-submit-btn');
        const errorMessages = form.querySelectorAll('.quote-error');

        // Hide previous errors
        errorMessages.forEach(error => {
            error.classList.remove('show');
        });

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Get form data
        const formData = new FormData(form);
        const constructionAreaEl = document.getElementById('construction-area');
        const builtUpAreaEl = document.getElementById('built-up-area');
        const floorsValue = formData.get('number-of-floors') || 'G';
        
        let constructionAreaLabel = 'N/A';
        let constructionAreaSqft = 0;
        
        if (constructionAreaEl && constructionAreaEl.value) {
            const areaInfo = CONSTRUCTION_AREAS[constructionAreaEl.value] || { label: 'N/A', sqft: 0 };
            constructionAreaLabel = areaInfo.label;
            constructionAreaSqft = areaInfo.sqft;
        } else if (builtUpAreaEl && builtUpAreaEl.value) {
            constructionAreaSqft = parseFloat(builtUpAreaEl.value);
            constructionAreaLabel = `${constructionAreaSqft} Sqft`;
        }
        
        // Calculate final costs
        calculateCost();
        const constructionCost = document.getElementById('construction-cost-display').textContent;
        const interiorCost = document.getElementById('interior-cost-display').textContent || '₹0';
        const compoundWallCost = document.getElementById('compound-wall-cost-display').textContent || '₹0';
        const totalCost = document.getElementById('total-cost-display').textContent;
        
        const data = {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            constructionArea: constructionAreaLabel,
            constructionAreaSqft: constructionAreaSqft,
            numberOfFloors: floorsValue,
            constructionVariant: formData.get('construction-variant'),
            interiorAddon: formData.get('interior-addon-selected') || 'No',
            interiorType: formData.get('interior-addon-type') || 'N/A',
            interiorRate: formData.get('interior-addon-rate') || '0',
            compoundWallAddon: formData.get('compound-addon-selected') || 'No',
            compoundWallType: formData.get('compound-addon-type') || 'N/A',
            compoundWallRate: formData.get('compound-addon-rate') || '0',
            constructionCost: constructionCost,
            interiorCost: interiorCost,
            compoundWallCost: compoundWallCost,
            totalCost: totalCost
        };

        // Submit to Formspree
        fetch('https://formspree.io/f/mbddrdol', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                // Close main modal
                const modalOverlay = document.querySelector('.quote-modal-overlay');
                if (modalOverlay) {
                    modalOverlay.classList.remove('active');
                }
                
                // Show pricing summary modal with animation
                setTimeout(() => {
                    showPricingSummary(data);
                }, 300);
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(error => {
            alert('There was an error submitting your quote. Please try again.');
            console.error('Error:', error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Quote';
        });
    }

    // Show pricing summary modal
    function showPricingSummary(data) {
        const summaryModal = document.querySelector('.quote-summary-modal');
        if (!summaryModal) return;
        
        // Populate summary data
        document.getElementById('summary-name').textContent = data.name;
        document.getElementById('summary-email').textContent = data.email;
        document.getElementById('summary-phone').textContent = data.phone;
        document.getElementById('summary-area').textContent = data.constructionArea;
        document.getElementById('summary-floors').textContent = data.numberOfFloors;
        
        // Get variant label
        let variantLabel = 'N/A';
        if (data.constructionVariant === 'silver') variantLabel = 'Silver - Basic';
        else if (data.constructionVariant === 'gold') variantLabel = 'Gold - Mid';
        else if (data.constructionVariant === 'platinum') variantLabel = 'Platinum - Luxury';
        document.getElementById('summary-variant').textContent = variantLabel;
        
        // Interior addon
        const interiorSummary = document.getElementById('summary-interior');
        const interiorRow = document.getElementById('summary-interior-row');
        const interiorCostRow = document.getElementById('summary-interior-cost-row');
        if (data.interiorAddon === 'yes') {
            let interiorLabel = data.interiorType.charAt(0).toUpperCase() + data.interiorType.slice(1);
            interiorSummary.textContent = interiorLabel + ' Interiors';
            if (interiorRow) interiorRow.style.display = 'flex';
            if (interiorCostRow) interiorCostRow.style.display = 'flex';
        } else {
            if (interiorRow) interiorRow.style.display = 'none';
            if (interiorCostRow) interiorCostRow.style.display = 'none';
        }
        
        // Compound wall
        const compoundSummary = document.getElementById('summary-compound');
        const compoundRow = document.getElementById('summary-compound-row');
        const compoundCostRow = document.getElementById('summary-compound-cost-row');
        if (data.compoundWallAddon === 'yes') {
            let compoundLabel = data.compoundWallType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            compoundSummary.textContent = compoundLabel;
            if (compoundRow) compoundRow.style.display = 'flex';
            if (compoundCostRow) compoundCostRow.style.display = 'flex';
        } else {
            if (compoundRow) compoundRow.style.display = 'none';
            if (compoundCostRow) compoundCostRow.style.display = 'none';
        }
        
        // Costs
        document.getElementById('summary-construction-cost').textContent = data.constructionCost;
        document.getElementById('summary-interior-cost').textContent = data.interiorCost;
        document.getElementById('summary-compound-cost').textContent = data.compoundWallCost;
        document.getElementById('summary-total-cost').textContent = data.totalCost;
        
        // Show modal with animation
        summaryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate items
        setTimeout(() => {
            const items = summaryModal.querySelectorAll('.summary-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate-in');
                }, index * 100);
            });
        }, 100);
    }

    // Validate form
    function validateForm() {
        let isValid = true;
        const constructionArea = document.getElementById('construction-area').value;
        const constructionVariant = document.getElementById('construction-variant').value;
        const floorsEl = document.getElementById('number-of-floors');

        // Clear previous errors
        document.querySelectorAll('.quote-error').forEach(err => {
            err.classList.remove('show');
            err.textContent = '';
        });

        // Validate construction area
        const constructionAreaEl = document.getElementById('construction-area');
        if (constructionAreaEl) {
            if (!constructionArea || !CONSTRUCTION_AREAS[constructionArea]) {
                showError('construction-area-error', 'Please select a construction area');
                isValid = false;
            }
        }
        
        // Validate construction variant
        if (!constructionVariant) {
            showError('construction-variant-error', 'Please select a construction package');
            isValid = false;
        }
        
        // Validate number of floors
        if (floorsEl && !floorsEl.value) {
            showError('number-of-floors-error', 'Please select number of floors');
            isValid = false;
        }

        return isValid;
    }

    // Show error
    function showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initQuoteCalculator);
    } else {
        initQuoteCalculator();
    }
})();

// ============================================
// INTERIOR DESIGN CALCULATOR
// ============================================
(function() {
    'use strict';

    // Interior Design pricing - fixed package prices per BHK type
    // Values from rate sheet
    const IDESIGN_PRICES = {
        basic: {
            '1': 244680,  // 1 BHK - ₹2,44,680
            '2': 321130,  // 2 BHK - ₹3,21,130
            '3': 397580,  // 3 BHK - ₹3,97,580
            '4': 474030   // 4 BHK - ₹4,74,030
        },
        gold: {
            '1': 283850,  // 1 BHK - ₹2,83,850
            '2': 372000,  // 2 BHK - ₹3,72,000
            '3': 460150,  // 3 BHK - ₹4,60,150
            '4': 548300   // 4 BHK - ₹5,48,300
        },
        premium: {
            '1': 391430,  // 1 BHK - ₹3,91,430
            '2': 512380,  // 2 BHK - ₹5,12,380
            '3': 633330,  // 3 BHK - ₹6,33,330
            '4': 754280   // 4 BHK - ₹7,54,280
        }
    };
    
    // Warranty information
    const IDESIGN_WARRANTY = {
        'basic': '7 Years Warranty',
        'gold': '10 Years Warranty',
        'premium': '15 Years Warranty'
    };
    
    // BHK type labels
    const IDESIGN_BHK = {
        '1': { label: '1 BHK' },
        '2': { label: '2 BHK' },
        '3': { label: '3 BHK' },
        '4': { label: '4 BHK' }
    };

    // Plan names
    const IDESIGN_PLANS = {
        'basic': 'Basic Plan',
        'gold': 'Gold Plan',
        'premium': 'Premium Plan'
    };

    // Customer info for interior design calculator
    let idesignCustomerInfo = {
        name: '',
        email: '',
        phone: ''
    };

    // Initialize the interior design calculator
    function initInteriorDesignCalculator() {
        const floatBtn = document.querySelector('.idesign-float-btn');
        const modalOverlay = document.querySelector('.idesign-modal-overlay');
        const closeBtn = document.querySelector('.idesign-modal-close');
        const bhkSelect = document.getElementById('idesign-bhk');
        const planSelect = document.getElementById('idesign-plan');
        const form = document.getElementById('idesign-calculator-form');
        const contactForm = document.getElementById('idesign-contact-form');
        const nextBtn = document.getElementById('idesign-contact-next-btn');

        // Open modal - show step 1 (contact form)
        if (floatBtn) {
            floatBtn.addEventListener('click', function() {
                resetIDesignModal();
                showIDesignStep(1);
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', closeIDesignModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) {
                    closeIDesignModal();
                }
            });
        }

        // Close summary modal
        const summaryCloseBtn = document.querySelector('.idesign-summary-modal-close');
        const summaryModal = document.querySelector('.idesign-summary-modal');
        if (summaryCloseBtn) {
            summaryCloseBtn.addEventListener('click', function() {
                if (summaryModal) {
                    summaryModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
        if (summaryModal) {
            summaryModal.addEventListener('click', function(e) {
                if (e.target === summaryModal) {
                    summaryModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Handle contact form submission (Step 1)
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (validateIDesignContactForm()) {
                    // Store customer info
                    idesignCustomerInfo.name = document.getElementById('idesign-contact-name').value.trim();
                    idesignCustomerInfo.email = document.getElementById('idesign-contact-email').value.trim();
                    idesignCustomerInfo.phone = document.getElementById('idesign-contact-phone').value.trim();
                    // Move to step 2
                    showIDesignStep(2);
                }
            });
        }

        // Handle next button click
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (validateIDesignContactForm()) {
                    idesignCustomerInfo.name = document.getElementById('idesign-contact-name').value.trim();
                    idesignCustomerInfo.email = document.getElementById('idesign-contact-email').value.trim();
                    idesignCustomerInfo.phone = document.getElementById('idesign-contact-phone').value.trim();
                    showIDesignStep(2);
                }
            });
        }

        // Check if both BHK and Plan are selected, then show materials
        function checkAndShowMaterials() {
            const bhkValue = bhkSelect ? bhkSelect.value : '';
            const planValue = planSelect ? planSelect.value : '';
            
            // Only show materials if BOTH are selected
            if (bhkValue && planValue) {
                showIDesignPlanMaterials(planValue);
            } else {
                // Hide materials if either is not selected
                const materialsContainer = document.getElementById('idesign-plan-materials-container');
                if (materialsContainer) {
                    materialsContainer.classList.remove('active');
                }
            }
            
            // Always hide cost until submission
            hideIDesignCostDisplay();
        }

        // Handle BHK selection
        if (bhkSelect) {
            bhkSelect.addEventListener('change', function() {
                checkAndShowMaterials();
            });
        }

        // Handle plan selection
        if (planSelect) {
            planSelect.addEventListener('change', function() {
                checkAndShowMaterials();
            });
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', handleIDesignFormSubmit);
        }

        // Hide cost display initially
        hideIDesignCostDisplay();
        
        // Ensure step 1 is visible and step 2 is hidden on initialization
        const step1 = document.getElementById('idesign-step-1');
        const step2 = document.getElementById('idesign-step-2');
        if (step1) {
            step1.classList.add('active');
            step1.style.display = 'block';
            step1.style.visibility = 'visible';
            step1.style.opacity = '1';
        }
        if (step2) {
            step2.classList.remove('active');
            step2.style.display = 'none';
            step2.style.visibility = 'hidden';
            step2.style.opacity = '0';
        }
    }

    // Show step function for interior design
    function showIDesignStep(step) {
        const step1 = document.getElementById('idesign-step-1');
        const step2 = document.getElementById('idesign-step-2');
        const modalHeader = document.querySelector('.idesign-modal-header h3');
        
        if (step === 1) {
            if (step1) {
                step1.classList.add('active');
                step1.style.display = 'block';
                step1.style.visibility = 'visible';
                step1.style.opacity = '1';
            }
            if (step2) {
                step2.classList.remove('active');
                step2.style.display = 'none';
                step2.style.visibility = 'hidden';
                step2.style.opacity = '0';
            }
            if (modalHeader) modalHeader.textContent = 'Interior Design Calculator - Step 1';
        } else if (step === 2) {
            if (step1) {
                step1.classList.remove('active');
                step1.style.display = 'none';
                step1.style.visibility = 'hidden';
                step1.style.opacity = '0';
            }
            if (step2) {
                step2.classList.add('active');
                step2.style.display = 'block';
                step2.style.visibility = 'visible';
                step2.style.opacity = '1';
            }
            if (modalHeader) modalHeader.textContent = 'Interior Design Calculator - Step 2';
            // Pre-fill customer info in hidden fields
            const nameField = document.getElementById('idesign-customer-name');
            const emailField = document.getElementById('idesign-customer-email');
            const phoneField = document.getElementById('idesign-customer-phone');
            if (nameField) nameField.value = idesignCustomerInfo.name;
            if (emailField) emailField.value = idesignCustomerInfo.email;
            if (phoneField) phoneField.value = idesignCustomerInfo.phone;
        }
    }

    // Reset modal for interior design
    function resetIDesignModal() {
        idesignCustomerInfo = { name: '', email: '', phone: '' };
        const form = document.getElementById('idesign-calculator-form');
        const contactForm = document.getElementById('idesign-contact-form');
        if (form) form.reset();
        if (contactForm) contactForm.reset();
        
        // Hide material specs
        const specsContainer = document.getElementById('idesign-material-specs-container');
        if (specsContainer) specsContainer.style.display = 'none';
        
        // Hide plan materials
        const planMaterialsContainer = document.getElementById('idesign-plan-materials-container');
        if (planMaterialsContainer) planMaterialsContainer.classList.remove('active');
        
        // Hide cost summary
        hideIDesignCostDisplay();
        
        // Ensure step 1 is visible and step 2 is hidden
        const step1 = document.getElementById('idesign-step-1');
        const step2 = document.getElementById('idesign-step-2');
        if (step1) {
            step1.classList.add('active');
            step1.style.display = 'block';
            step1.style.visibility = 'visible';
            step1.style.opacity = '1';
        }
        if (step2) {
            step2.classList.remove('active');
            step2.style.display = 'none';
            step2.style.visibility = 'hidden';
            step2.style.opacity = '0';
        }
    }

    // Validate contact form for interior design
    function validateIDesignContactForm() {
        let isValid = true;
        const name = document.getElementById('idesign-contact-name').value.trim();
        const email = document.getElementById('idesign-contact-email').value.trim();
        const phone = document.getElementById('idesign-contact-phone').value.trim();

        // Clear previous errors
        document.querySelectorAll('.idesign-error').forEach(err => {
            err.classList.remove('show');
            err.textContent = '';
        });

        // Validate name
        if (name.length < 2) {
            showIDesignError('idesign-contact-name-error', 'Please enter a valid name');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showIDesignError('idesign-contact-email-error', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            showIDesignError('idesign-contact-phone-error', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        return isValid;
    }

    // Material specifications for each plan
    const IDESIGN_MATERIALS = {
        basic: [
            { material: 'Plywood', spec: 'Royal Classic PLY (GARJAN, FACING)' },
            { material: 'Laminates', spec: 'RAJGUEU, CRYSRTAL - LAMINATES' },
            { material: 'Plywood Grade', spec: 'DIY WOOD NEEMPLY-BWP' },
            { material: 'Fittings', spec: 'REGULAR/FITTING' },
            { material: 'Hinges', spec: 'REGULAR HINGES - NORMAL SHUT' },
            { material: 'Handles', spec: 'SS - HANDLES PER DESIGN' },
            { material: 'Wet Area', spec: 'WFT AREA NEEMPLY - 10 YEARS' },
            { material: 'Warranty', spec: '7 YEARS WARRANTY - FITTING' }
        ],
        gold: [
            { material: 'Plywood', spec: 'GARJAN-PLY' },
            { material: 'Laminates', spec: 'PREMIUM - LAMINATES' },
            { material: 'Plywood Grade', spec: 'BWP-GREEN PLY' },
            { material: 'Fittings', spec: 'EBCO/HAFFELE FITTING' },
            { material: 'Hinges', spec: 'SOFT CLOSING/REGULAR' },
            { material: 'Handles', spec: 'GPROFILE HANDLES - KITCHEN' },
            { material: 'Accessories', spec: 'ACCESSORIES' },
            { material: 'Warranty', spec: '10 YEARS WARRANTY' }
        ],
        premium: [
            { material: 'Plywood', spec: 'CENTURY-PLY-NEEM PLY' },
            { material: 'Laminates', spec: 'HDHML - ACRYLIC LAMINATES' },
            { material: 'Plywood Grade', spec: 'CENTURY PLY BWP' },
            { material: 'Fittings', spec: 'HETTICH-HAFFELE/FITTING' },
            { material: 'Hinges', spec: 'Premium Soft Closing' },
            { material: 'Handles', spec: 'Premium Kitchen Handles' },
            { material: 'Accessories', spec: 'KITCHEN ACCESSORIES ADDITIONAL HYDRAULIC' },
            { material: 'Warranty', spec: '15 YEARS WARRANTY' }
        ]
    };

    // Show plan-specific materials table
    function showIDesignPlanMaterials(plan) {
        const materialsContainer = document.getElementById('idesign-plan-materials-container');
        const materialsTable = document.getElementById('idesign-plan-materials-table');
        
        if (!plan || !materialsContainer || !materialsTable) {
            if (materialsContainer) {
                materialsContainer.classList.remove('active');
            }
            return;
        }
        
        const materials = IDESIGN_MATERIALS[plan];
        if (!materials) {
            materialsContainer.classList.remove('active');
            return;
        }
        
        // Clear existing rows (except header)
        const tbody = materialsTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            // Add material rows
            materials.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.material}</td>
                    <td>${item.spec}</td>
                `;
                tbody.appendChild(row);
            });
        }
        
        // Show container with animation
        materialsContainer.classList.add('active');
    }

    // Show material specifications for interior design (comparison table - keep for reference)
    function showIDesignMaterialSpecs(plan) {
        const specsContainer = document.getElementById('idesign-material-specs-container');
        const specsTable = document.getElementById('idesign-material-specs-table');
        
        if (!plan) {
            if (specsContainer) specsContainer.style.display = 'none';
            return;
        }
        
        if (specsContainer && specsTable) {
            specsContainer.style.display = 'block';
            
            // Highlight the selected plan column
            const headerCells = specsTable.querySelectorAll('thead th');
            const bodyRows = specsTable.querySelectorAll('tbody tr');
            
            // Reset all columns
            headerCells.forEach((th, index) => {
                if (index > 0) {
                    th.style.backgroundColor = '';
                    th.style.color = '';
                }
            });
            
            bodyRows.forEach(row => {
                row.querySelectorAll('td').forEach((td, index) => {
                    if (index > 0) {
                        td.style.backgroundColor = '';
                        td.style.fontWeight = '';
                    }
                });
            });
            
            // Highlight selected plan column
            let columnIndex = 0;
            if (plan === 'basic') columnIndex = 1;
            else if (plan === 'gold') columnIndex = 2;
            else if (plan === 'premium') columnIndex = 3;
            
            if (columnIndex > 0 && headerCells[columnIndex]) {
                headerCells[columnIndex].style.backgroundColor = '#D1B06B';
                headerCells[columnIndex].style.color = '#fff';
                
                bodyRows.forEach(row => {
                    const cell = row.querySelectorAll('td')[columnIndex];
                    if (cell) {
                        cell.style.backgroundColor = '#fff8e1';
                        cell.style.fontWeight = '600';
                    }
                });
            }
        }
    }

    // Hide cost display (only show after submission)
    function hideIDesignCostDisplay() {
        const costSummary = document.getElementById('idesign-cost-summary');
        if (costSummary) {
            costSummary.style.display = 'none';
        }
    }

    // Calculate interior design cost
    function calculateIDesignCost() {
        const bhkEl = document.getElementById('idesign-bhk');
        const planEl = document.getElementById('idesign-plan');

        if (!bhkEl || !planEl) {
            return 0;
        }

        const bhk = bhkEl.value;
        const plan = planEl.value;
        
        let totalCost = 0;
        
        if (bhk && plan && IDESIGN_PRICES[plan] && IDESIGN_PRICES[plan][bhk]) {
            totalCost = IDESIGN_PRICES[plan][bhk];
        }
        
        return totalCost;
    }

    // Update cost display for interior design (only called after submission)
    function updateIDesignCostDisplay(bhk, plan, totalCost) {
        const bhkDisplay = document.getElementById('idesign-bhk-display');
        const planDisplay = document.getElementById('idesign-plan-display');
        const totalDisplay = document.getElementById('idesign-total-cost-display');
        const warrantyDisplay = document.getElementById('idesign-warranty-display');
        const costSummary = document.getElementById('idesign-cost-summary');

        if (bhkDisplay) {
            bhkDisplay.textContent = bhk && IDESIGN_BHK[bhk] ? IDESIGN_BHK[bhk].label : '-';
        }

        if (planDisplay) {
            planDisplay.textContent = plan && IDESIGN_PLANS[plan] ? IDESIGN_PLANS[plan] : '-';
        }

        if (warrantyDisplay && plan) {
            warrantyDisplay.textContent = IDESIGN_WARRANTY[plan] || '-';
        }

        if (totalDisplay) {
            totalDisplay.textContent = formatCurrencyIDesign(totalCost);
        }

        // Show cost summary only after submission
        if (costSummary) {
            costSummary.style.display = 'block';
        }
    }

    // Format currency for interior design
    function formatCurrencyIDesign(amount) {
        if (amount === 0) return '₹0';
        return '₹' + amount.toLocaleString('en-IN');
    }

    // Close modal for interior design
    function closeIDesignModal() {
        const modalOverlay = document.querySelector('.idesign-modal-overlay');
        const summaryModal = document.querySelector('.idesign-summary-modal');
        
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            resetIDesignModal();
            showIDesignStep(1);
        }
        
        if (summaryModal) {
            summaryModal.classList.remove('active');
        }
    }

    // Handle form submission for interior design
    function handleIDesignFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('.idesign-submit-btn');

        // Hide previous errors
        document.querySelectorAll('.idesign-error').forEach(error => {
            error.classList.remove('show');
        });

        // Validate form
        if (!validateIDesignForm()) {
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Get form data
        const bhkValue = document.getElementById('idesign-bhk').value;
        const planValue = document.getElementById('idesign-plan').value;
        
        // Calculate final cost
        const totalCostAmount = calculateIDesignCost();
        const totalCostFormatted = formatCurrencyIDesign(totalCostAmount);
        
        // Show cost display in the form now that form is being submitted
        updateIDesignCostDisplay(bhkValue, planValue, totalCostAmount);
        
        // Scroll to cost summary to make it visible
        const costSummary = document.getElementById('idesign-cost-summary');
        if (costSummary) {
            costSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        const data = {
            name: idesignCustomerInfo.name,
            email: idesignCustomerInfo.email,
            phone: idesignCustomerInfo.phone,
            bhk: bhkValue,
            bhkLabel: IDESIGN_BHK[bhkValue] ? IDESIGN_BHK[bhkValue].label : 'N/A',
            plan: planValue,
            planLabel: IDESIGN_PLANS[planValue] || 'N/A',
            warranty: IDESIGN_WARRANTY[planValue] || 'N/A',
            totalCost: totalCostFormatted,
            totalCostAmount: totalCostAmount
        };

        // Submit to Formspree
        fetch('https://formspree.io/f/mbddrdol', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                // Wait a moment to show the cost in the form, then show summary modal
                setTimeout(() => {
                    // Close main modal
                    const modalOverlay = document.querySelector('.idesign-modal-overlay');
                    if (modalOverlay) {
                        modalOverlay.classList.remove('active');
                    }
                    
                    // Show pricing summary modal with animation
                    setTimeout(() => {
                        showIDesignPricingSummary(data);
                    }, 300);
                }, 1500); // Show cost for 1.5 seconds before closing
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(error => {
            alert('There was an error submitting your quote. Please try again.');
            console.error('Error:', error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Quote';
        });
    }

    // Show pricing summary modal for interior design
    function showIDesignPricingSummary(data) {
        const summaryModal = document.querySelector('.idesign-summary-modal');
        if (!summaryModal) return;
        
        // Populate summary data
        document.getElementById('idesign-summary-name').textContent = data.name;
        document.getElementById('idesign-summary-email').textContent = data.email;
        document.getElementById('idesign-summary-phone').textContent = data.phone;
        document.getElementById('idesign-summary-bhk').textContent = data.bhkLabel;
        document.getElementById('idesign-summary-plan').textContent = data.planLabel;
        document.getElementById('idesign-summary-warranty').textContent = data.warranty;
        document.getElementById('idesign-summary-total-cost').textContent = data.totalCost;
        
        // Show modal with animation
        summaryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Validate form for interior design
    function validateIDesignForm() {
        let isValid = true;
        const bhk = document.getElementById('idesign-bhk').value;
        const plan = document.getElementById('idesign-plan').value;

        // Clear previous errors
        document.querySelectorAll('.idesign-error').forEach(err => {
            err.classList.remove('show');
            err.textContent = '';
        });

        // Validate BHK
        if (!bhk) {
            showIDesignError('idesign-bhk-error', 'Please select BHK type');
            isValid = false;
        }
        
        // Validate plan
        if (!plan) {
            showIDesignError('idesign-plan-error', 'Please select an interior plan');
            isValid = false;
        }

        return isValid;
    }

    // Show error for interior design
    function showIDesignError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInteriorDesignCalculator);
    } else {
        initInteriorDesignCalculator();
    }
})();
