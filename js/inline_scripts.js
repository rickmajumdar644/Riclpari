
    let currentMode = 'pair';

    // Toggle functionality
    document.querySelectorAll('.toggle-option').forEach(option => {
      option.addEventListener('click', function() {
        const mode = this.dataset.mode;
        if (mode === currentMode) return;

        // Update active state
        document.querySelectorAll('.toggle-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');

        // Update mode
        currentMode = mode;

        // Update button and input visibility
        const submitBtn = document.getElementById('submit');
        const inputGroup = document.getElementById('inputGroup');
        
        if (mode === 'pair') {
          submitBtn.innerHTML = '<i class="fas fa-key"></i> Generate Pair Code';
          submitBtn.classList.remove('hidden');
          inputGroup.classList.remove('hidden');
        } else {
          submitBtn.classList.add('hidden');
          inputGroup.classList.add('hidden');
          // Auto-generate QR code when QR mode is selected
          generateQRCode();
        }

        // Clear displays
        document.getElementById('codeDisplay').innerHTML = 'Your pair code will appear here';
        document.getElementById('qrDisplay').style.display = 'none';
        document.getElementById('codeDisplay').style.display = 'flex';
      });
    });

    async function generateQRCode() {
      const codeDisplay = document.getElementById("codeDisplay");
      const qrDisplay = document.getElementById("qrDisplay");
      const loadingSpinner = document.getElementById("loading");

      loadingSpinner.style.display = "block";
      codeDisplay.innerHTML = '';
      qrDisplay.style.display = 'none';

      try {
        const response = await axios('/qr');
        
        if (response.data.qr) {
          document.getElementById('qrImage').src = response.data.qr;
          document.getElementById('qrInstructions').innerHTML = response.data.instructions.join('<br>');
          qrDisplay.style.display = 'block';
          codeDisplay.style.display = 'none';
        } else {
          codeDisplay.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Failed to generate QR code</div>';
          codeDisplay.style.display = 'flex';
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
        codeDisplay.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Error generating QR code. Please try again.</div>';
        codeDisplay.style.display = 'flex';
      } finally {
        loadingSpinner.style.display = "none";
      }
    }

    document.getElementById("submit").addEventListener("click", async (e) => {
      e.preventDefault();
      
      const mobileNumberInput = document.getElementById("mobileNumber");
      const codeDisplay = document.getElementById("codeDisplay");
      const qrDisplay = document.getElementById("qrDisplay");
      const loadingSpinner = document.getElementById("loading");

      const mobileNumber = mobileNumberInput.value.trim();
      if (!mobileNumber) {
        codeDisplay.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Please enter your WhatsApp number</div>';
        return;
      }

      loadingSpinner.style.display = "block";
      codeDisplay.innerHTML = '';
      qrDisplay.style.display = 'none';

      try {
        const response = await axios(`/pair?number=${mobileNumber.replace(/[^0-9]/g, "")}`);
        
        const code = response.data.code || "Service Unavailable";
        if (code === "Service Unavailable") {
          codeDisplay.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Service Unavailable</div>';
        } else {
          codeDisplay.innerHTML = `<div class="success-message"><i class="fas fa-check-circle"></i> CODE: ${code}</div>`;
        }
        codeDisplay.style.display = 'flex';
      } catch (error) {
        console.error("Error generating code:", error);
        codeDisplay.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Error generating code. Please try again.</div>';
        codeDisplay.style.display = 'flex';
      } finally {
        loadingSpinner.style.display = "none";
      }
    });
    function copyCode() {
      const codeDisplay = document.getElementById("codeDisplay").innerText;
      const code = codeDisplay.replace('CODE: ', '');
      navigator.clipboard.writeText(code).then(() => {
        const copyBtn = document.getElementById("copy");
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      }).catch(err => {
        console.error("Failed to copy text: ", err);
      });
    }
  
