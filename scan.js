
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const scanOptions = document.querySelectorAll('.scan-option');
  const scanContents = document.querySelectorAll('.scan-content');
  const startCameraBtn = document.getElementById('start-camera');
  const takePhotoBtn = document.getElementById('take-photo');
  const switchCameraBtn = document.getElementById('switch-camera');
  const cameraView = document.getElementById('camera-view');
  const cameraStream = document.getElementById('camera-stream');
  const cameraCanvas = document.getElementById('camera-canvas');
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const browseButton = document.querySelector('.browse-button');
  const previewImage = document.getElementById('preview-image');
  const imagePreview = document.getElementById('image-preview');
  const removeImageBtn = document.getElementById('remove-image');
  const analyzeButton = document.getElementById('analyze-button');
  const analysisResults = document.getElementById('analysis-results');
  const saveResultsBtn = document.getElementById('save-results');
  const newScanBtn = document.getElementById('new-scan');
  const contactExpertsSection = document.getElementById('contact-experts');
  
  // Global variables
  let stream = null;
  let facingMode = 'environment'; // Start with rear camera
  let hasImage = false;
  
  // Check login status
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginButton = document.querySelector('.auth-buttons .btn-outline-light');
  const signupButton = document.querySelector('.auth-buttons .btn-primary');
  
  if (isLoggedIn) {
    const userName = localStorage.getItem('userName') || 'User';
    loginButton.innerHTML = `<i class="fas fa-user"></i> ${userName}`;
    loginButton.href = '#';
    signupButton.innerHTML = 'Log out';
    signupButton.href = '#';
    signupButton.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      window.location.reload();
    });
  }
  
  // Switch between scan options (Camera/Upload)
  scanOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      scanOptions.forEach(opt => opt.classList.remove('active'));
      // Add active class to clicked option
      this.classList.add('active');
      
      // Hide all content sections
      scanContents.forEach(content => content.classList.remove('active'));
      
      // Show selected content
      const optionType = this.getAttribute('data-option');
      document.getElementById(`${optionType}-content`).classList.add('active');
      
      // Reset UI state
      analyzeButton.disabled = !hasImage;
      analysisResults.classList.remove('active');
      if (contactExpertsSection) {
        contactExpertsSection.classList.remove('active');
      }
    });
  });
  
  // ------ Camera Functionality ------
  
  // Start camera
  startCameraBtn.addEventListener('click', async function() {
    try {
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Get camera stream
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      });
      
      // Display stream
      cameraStream.srcObject = stream;
      cameraStream.style.display = 'block';
      cameraStream.classList.add('active');
      cameraView.querySelector('.camera-placeholder').style.display = 'none';
      
      // Enable buttons
      takePhotoBtn.disabled = false;
      switchCameraBtn.disabled = false;
      startCameraBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Camera';
      startCameraBtn.classList.add('active');
      
      // Update event listener for start/stop
      startCameraBtn.removeEventListener('click', arguments.callee);
      startCameraBtn.addEventListener('click', stopCamera);
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Error accessing camera. Please make sure you have granted camera permissions.');
    }
  });
  
  // Stop camera
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    
    // Reset UI
    cameraStream.srcObject = null;
    cameraStream.style.display = 'none';
    cameraStream.classList.remove('active');
    cameraView.querySelector('.camera-placeholder').style.display = 'flex';
    
    // Disable buttons
    takePhotoBtn.disabled = true;
    switchCameraBtn.disabled = true;
    startCameraBtn.innerHTML = '<i class="fas fa-power-off"></i> Start Camera';
    startCameraBtn.classList.remove('active');
    
    // Update event listener
    startCameraBtn.removeEventListener('click', stopCamera);
    startCameraBtn.addEventListener('click', startCameraBtn.onclick);
  }
  
  // Take photo
  takePhotoBtn.addEventListener('click', function() {
    if (!stream) return;
    
    // Set canvas size to match video
    cameraCanvas.width = cameraStream.videoWidth;
    cameraCanvas.height = cameraStream.videoHeight;
    
    // Draw video frame to canvas
    const context = cameraCanvas.getContext('2d');
    context.drawImage(cameraStream, 0, 0, cameraCanvas.width, cameraCanvas.height);
    
    // Convert to data URL
    const imageDataUrl = cameraCanvas.toDataURL('image/png');
    
    // Show preview in camera view
    const img = new Image();
    img.src = imageDataUrl;
    img.onload = function() {
      // Clear the camera view
      const context = cameraCanvas.getContext('2d');
      context.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);
      
      // Draw the image centered
      context.drawImage(img, 0, 0, cameraCanvas.width, cameraCanvas.height);
      
      // Display the canvas
      cameraStream.style.display = 'none';
      cameraCanvas.style.display = 'block';
      
      // Enable analyze button
      hasImage = true;
      analyzeButton.disabled = false;
    };
    
    // Stop the camera
    stopCamera();
  });
  
  // Switch camera
  switchCameraBtn.addEventListener('click', async function() {
    // Toggle facing mode
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    
    // Restart camera with new facing mode
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      });
      
      cameraStream.srcObject = stream;
    } catch (err) {
      console.error('Error switching camera:', err);
      alert('Error switching camera. Your device might not have multiple cameras.');
    }
  });
  
  // ------ Upload Functionality ------
  
  // Handle file selection via button
  browseButton.addEventListener('click', function() {
    fileInput.click();
  });
  
  // Handle file selection
  fileInput.addEventListener('change', function(e) {
    handleFileSelect(e.target.files);
  });
  
  // Upload area click
  uploadArea.addEventListener('click', function(e) {
    if (e.target === uploadArea || e.target.closest('.upload-placeholder')) {
      fileInput.click();
    }
  });
  
  // Drag and drop
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });
  
  uploadArea.addEventListener('dragleave', function() {
    uploadArea.classList.remove('drag-over');
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFileSelect(e.dataTransfer.files);
  });
  
  // Process the selected file
  function handleFileSelect(files) {
    if (!files || !files[0]) return;
    
    const file = files[0];
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please select an image under 5MB.');
      return;
    }
    
    // Read and preview the file
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Set the preview image source
      previewImage.src = e.target.result;
      
      // Show preview and hide placeholder
      document.querySelector('.upload-placeholder').style.display = 'none';
      imagePreview.classList.add('active');
      
      // Enable the analyze button
      hasImage = true;
      analyzeButton.disabled = false;
    };
    
    reader.readAsDataURL(file);
  }
  
  // Remove uploaded image
  removeImageBtn.addEventListener('click', function() {
    // Clear the file input
    fileInput.value = '';
    
    // Hide preview and show placeholder
    document.querySelector('.upload-placeholder').style.display = 'flex';
    imagePreview.classList.remove('active');
    
    // Disable analyze button
    hasImage = false;
    analyzeButton.disabled = true;
  });
  
  // ------ Analysis Functionality ------
  
  // Analyze button
  analyzeButton.addEventListener('click', function() {
    // Show loading state
    analyzeButton.disabled = true;
    analyzeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    
    // Simulate analysis process (would be replaced with actual API call)
    setTimeout(function() {
      // Show results
      analysisResults.classList.add('active');
      
      // Show contact experts section
      if (contactExpertsSection) {
        contactExpertsSection.classList.add('active');
      }
      
      // Reset button
      analyzeButton.innerHTML = '<i class="fas fa-microscope"></i> Analyze Image';
      analyzeButton.disabled = true;
    }, 2500);
  });
  
  // Save results
  saveResultsBtn.addEventListener('click', function() {
    alert('Results saved! (This is a demo function)');
  });
  
  // New scan
  newScanBtn.addEventListener('click', function() {
    // Reset UI
    hasImage = false;
    analyzeButton.disabled = true;
    analysisResults.classList.remove('active');
    
    // Hide contact experts section
    if (contactExpertsSection) {
      contactExpertsSection.classList.remove('active');
    }
    
    // Reset camera view
    if (document.querySelector('.scan-option[data-option="camera"]').classList.contains('active')) {
      cameraCanvas.style.display = 'none';
      cameraView.querySelector('.camera-placeholder').style.display = 'flex';
    } else {
      // Reset upload view
      fileInput.value = '';
      document.querySelector('.upload-placeholder').style.display = 'flex';
      imagePreview.classList.remove('active');
    }
  });
  
  // Contact expert buttons functionality
  if (contactExpertsSection) {
    const expertButtons = contactExpertsSection.querySelectorAll('.expert-btn');
    expertButtons.forEach(button => {
      button.addEventListener('click', function() {
        const contactType = this.getAttribute('data-contact');
        
        if (contactType === 'call') {
          alert('Initiating call with our medical experts... (This is a demo)');
        } else if (contactType === 'chat') {
          alert('Starting chat with our medical experts... (This is a demo)');
        } else if (contactType === 'email') {
          alert('Sending email request to our medical experts... (This is a demo)');
        } else if (contactType === 'appointment') {
          alert('Opening appointment booking system... (This is a demo)');
        }
      });
    });
  }
});





document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const scanOptions = document.querySelectorAll('.scan-option');
  const scanContents = document.querySelectorAll('.scan-content');
  const startCameraBtn = document.getElementById('start-camera');
  const takePhotoBtn = document.getElementById('take-photo');
  const switchCameraBtn = document.getElementById('switch-camera');
  const cameraView = document.getElementById('camera-view');
  const cameraStream = document.getElementById('camera-stream');
  const cameraCanvas = document.getElementById('camera-canvas');
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const browseButton = document.querySelector('.browse-button');
  const previewImage = document.getElementById('preview-image');
  const imagePreview = document.getElementById('image-preview');
  const removeImageBtn = document.getElementById('remove-image');
  const analyzeButton = document.getElementById('analyze-button');
  const analysisResults = document.getElementById('analysis-results');
  const saveResultsBtn = document.getElementById('save-results');
  const newScanBtn = document.getElementById('new-scan');
  const contactExpertsSection = document.getElementById('contact-experts');
  
  // Global variables
  let stream = null;
  let facingMode = 'environment'; // Start with rear camera
  let hasImage = false;
  
  // Check login status
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginButton = document.querySelector('.auth-buttons .btn-outline-light');
  const signupButton = document.querySelector('.auth-buttons .btn-primary');
  
  if (isLoggedIn) {
    const userName = localStorage.getItem('userName') || 'User';
    loginButton.innerHTML = `<i class="fas fa-user"></i> ${userName}`;
    loginButton.href = '#';
    signupButton.innerHTML = 'Log out';
    signupButton.href = '#';
    signupButton.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      window.location.reload();
    });
  }
  
  // Switch between scan options (Camera/Upload)
  scanOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      scanOptions.forEach(opt => opt.classList.remove('active'));
      // Add active class to clicked option
      this.classList.add('active');
      
      // Hide all content sections
      scanContents.forEach(content => content.classList.remove('active'));
      
      // Show selected content
      const optionType = this.getAttribute('data-option');
      document.getElementById(`${optionType}-content`).classList.add('active');
      
      // Reset UI state
      analyzeButton.disabled = !hasImage;
      analysisResults.classList.remove('active');
      if (contactExpertsSection) {
        contactExpertsSection.classList.remove('active');
      }
    });
  });
  
  // ------ Camera Functionality ------
  
  // Start camera
  startCameraBtn.addEventListener('click', async function() {
    try {
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Get camera stream
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      });
      
      // Display stream
      cameraStream.srcObject = stream;
      cameraStream.style.display = 'block';
      cameraStream.classList.add('active');
      cameraView.querySelector('.camera-placeholder').style.display = 'none';
      
      // Enable buttons
      takePhotoBtn.disabled = false;
      switchCameraBtn.disabled = false;
      startCameraBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Camera';
      startCameraBtn.classList.add('active');
      
      // Update event listener for start/stop
      startCameraBtn.removeEventListener('click', arguments.callee);
      startCameraBtn.addEventListener('click', stopCamera);
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Error accessing camera. Please make sure you have granted camera permissions.');
    }
  });
  
  // Stop camera
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    
    // Reset UI
    cameraStream.srcObject = null;
    cameraStream.style.display = 'none';
    cameraStream.classList.remove('active');
    cameraView.querySelector('.camera-placeholder').style.display = 'flex';
    
    // Disable buttons
    takePhotoBtn.disabled = true;
    switchCameraBtn.disabled = true;
    startCameraBtn.innerHTML = '<i class="fas fa-power-off"></i> Start Camera';
    startCameraBtn.classList.remove('active');
    
    // Update event listener
    startCameraBtn.removeEventListener('click', stopCamera);
    startCameraBtn.addEventListener('click', startCameraBtn.onclick);
  }
  
  // Take photo
  takePhotoBtn.addEventListener('click', function() {
    if (!stream) return;
    
    // Set canvas size to match video
    cameraCanvas.width = cameraStream.videoWidth;
    cameraCanvas.height = cameraStream.videoHeight;
    
    // Draw video frame to canvas
    const context = cameraCanvas.getContext('2d');
    context.drawImage(cameraStream, 0, 0, cameraCanvas.width, cameraCanvas.height);
    
    // Convert to data URL
    const imageDataUrl = cameraCanvas.toDataURL('image/png');
    
    // Show preview in camera view
    const img = new Image();
    img.src = imageDataUrl;
    img.onload = function() {
      // Clear the camera view
      const context = cameraCanvas.getContext('2d');
      context.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);
      
      // Draw the image centered
      context.drawImage(img, 0, 0, cameraCanvas.width, cameraCanvas.height);
      
      // Display the canvas
      cameraStream.style.display = 'none';
      cameraCanvas.style.display = 'block';
      
      // Enable analyze button
      hasImage = true;
      analyzeButton.disabled = false;
    };
    
    // Stop the camera
    stopCamera();
  });
  
  // Switch camera
  switchCameraBtn.addEventListener('click', async function() {
    // Toggle facing mode
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    
    // Restart camera with new facing mode
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      });
      
      cameraStream.srcObject = stream;
    } catch (err) {
      console.error('Error switching camera:', err);
      alert('Error switching camera. Your device might not have multiple cameras.');
    }
  });
  
  // ------ Upload Functionality ------
  
  // Handle file selection via button
  browseButton.addEventListener('click', function() {
    fileInput.click();
  });
  
  // Handle file selection
  fileInput.addEventListener('change', function(e) {
    handleFileSelect(e.target.files);
  });
  
  // Upload area click
  uploadArea.addEventListener('click', function(e) {
    if (e.target === uploadArea || e.target.closest('.upload-placeholder')) {
      fileInput.click();
    }
  });
  
  // Drag and drop
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });
  
  uploadArea.addEventListener('dragleave', function() {
    uploadArea.classList.remove('drag-over');
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFileSelect(e.dataTransfer.files);
  });
  
  // Process the selected file
  function handleFileSelect(files) {
    if (!files || !files[0]) return;
    
    const file = files[0];
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please select an image under 5MB.');
      return;
    }
    
    // Read and preview the file
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Set the preview image source
      previewImage.src = e.target.result;
      
      // Show preview and hide placeholder
      document.querySelector('.upload-placeholder').style.display = 'none';
      imagePreview.classList.add('active');
      
      // Enable the analyze button
      hasImage = true;
      analyzeButton.disabled = false;
    };
    
    reader.readAsDataURL(file);
  }
  
  // Remove uploaded image
  removeImageBtn.addEventListener('click', function() {
    // Clear the file input
    fileInput.value = '';
    
    // Hide preview and show placeholder
    document.querySelector('.upload-placeholder').style.display = 'flex';
    imagePreview.classList.remove('active');
    
    // Disable analyze button
    hasImage = false;
    analyzeButton.disabled = true;
  });
  
  // ------ Analysis Functionality ------
  
  // Analyze button
  analyzeButton.addEventListener('click', function() {
    // Show loading state
    analyzeButton.disabled = true;
    analyzeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    
    // Simulate analysis process (would be replaced with actual API call)
    setTimeout(function() {
      // Show results
      analysisResults.classList.add('active');
      
      // Show contact experts section
      if (contactExpertsSection) {
        contactExpertsSection.classList.add('active');
      }
      
      // Reset button
      analyzeButton.innerHTML = '<i class="fas fa-microscope"></i> Analyze Image';
      analyzeButton.disabled = true;
    }, 2500);
  });
  
  // Save results
  saveResultsBtn.addEventListener('click', function() {
    alert('Results saved! (This is a demo function)');
  });
  
  // New scan
  newScanBtn.addEventListener('click', function() {
    // Reset UI
    hasImage = false;
    analyzeButton.disabled = true;
    analysisResults.classList.remove('active');
    
    // Hide contact experts section
    if (contactExpertsSection) {
      contactExpertsSection.classList.remove('active');
    }
    
    // Reset camera view
    if (document.querySelector('.scan-option[data-option="camera"]').classList.contains('active')) {
      cameraCanvas.style.display = 'none';
      cameraView.querySelector('.camera-placeholder').style.display = 'flex';
    } else {
      // Reset upload view
      fileInput.value = '';
      document.querySelector('.upload-placeholder').style.display = 'flex';
      imagePreview.classList.remove('active');
    }
  });
  
  // Contact expert buttons functionality
  if (contactExpertsSection) {
    const expertButtons = contactExpertsSection.querySelectorAll('.expert-btn');
    expertButtons.forEach(button => {
      button.addEventListener('click', function() {
        const contactType = this.getAttribute('data-contact');
        
        if (contactType === 'call') {
          alert('Initiating call with our medical experts... (This is a demo)');
        } else if (contactType === 'chat') {
          alert('Starting chat with our medical experts... (This is a demo)');
        } else if (contactType === 'email') {
          alert('Sending email request to our medical experts... (This is a demo)');
        } else if (contactType === 'appointment') {
          alert('Opening appointment booking system... (This is a demo)');
        }
      });
    });
  }
});
