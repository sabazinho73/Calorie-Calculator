// Get form and results elements
const form = document.getElementById("calorieForm");
const resultsSection = document.getElementById("results");
const maintainElement = document.getElementById("maintain");
const mildElement = document.getElementById("mild");
const normalElement = document.getElementById("normal");
const extremeElement = document.getElementById("extreme");

// Unit toggle functionality
let heightUnit = "cm";
let weightUnit = "kg";

// Height unit toggle
const heightInputCm = document.getElementById("heightInputCm");
const heightInputFt = document.getElementById("heightInputFt");
const heightFormGroup = heightInputCm.parentElement;
const heightToggleBtns = heightFormGroup.querySelectorAll(
  ".unit-toggle .unit-btn"
);

heightToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const unit = this.getAttribute("data-unit");

    // Update active state
    this.parentElement
      .querySelectorAll(".unit-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");

    // Toggle input fields
    if (unit === "cm") {
      heightUnit = "cm";
      heightInputCm.classList.remove("hidden");
      heightInputFt.classList.add("hidden");
      // Remove required from ft/in inputs
      document.getElementById("heightFeet").removeAttribute("required");
      document.getElementById("heightInches").removeAttribute("required");
      // Add required to cm input
      document.getElementById("height").setAttribute("required", "required");
    } else if (unit === "ft") {
      heightUnit = "ft";
      heightInputCm.classList.add("hidden");
      heightInputFt.classList.remove("hidden");
      // Add required to ft/in inputs
      document
        .getElementById("heightFeet")
        .setAttribute("required", "required");
      document
        .getElementById("heightInches")
        .setAttribute("required", "required");
      // Remove required from cm input
      document.getElementById("height").removeAttribute("required");
    }
  });
});

// Weight unit toggle
const weightInputKg = document.getElementById("weightInputKg");
const weightInputLbs = document.getElementById("weightInputLbs");
const weightFormGroup = weightInputKg.parentElement;
const weightToggleBtns = weightFormGroup.querySelectorAll(
  ".unit-toggle .unit-btn"
);

weightToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const unit = this.getAttribute("data-unit");

    // Update active state
    this.parentElement
      .querySelectorAll(".unit-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");

    // Toggle input fields
    if (unit === "kg") {
      weightUnit = "kg";
      weightInputKg.classList.remove("hidden");
      weightInputLbs.classList.add("hidden");
      // Remove required from lbs input
      document.getElementById("weightLbs").removeAttribute("required");
      // Add required to kg input
      document.getElementById("weight").setAttribute("required", "required");
    } else if (unit === "lbs") {
      weightUnit = "lbs";
      weightInputKg.classList.add("hidden");
      weightInputLbs.classList.remove("hidden");
      // Add required to lbs input
      document.getElementById("weightLbs").setAttribute("required", "required");
      // Remove required from kg input
      document.getElementById("weight").removeAttribute("required");
    }
  });
});

// Form submission handler
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const age = parseInt(document.getElementById("age").value);
  const genderInput = document.querySelector('input[name="gender"]:checked');

  if (!genderInput) {
    alert("Please select your gender");
    return;
  }

  const gender = genderInput.value;

  // Get height in cm
  let height;
  if (heightUnit === "cm") {
    height = parseInt(document.getElementById("height").value);
  } else {
    const feet = parseInt(document.getElementById("heightFeet").value) || 0;
    const inches = parseInt(document.getElementById("heightInches").value) || 0;
    height = Math.round(feet * 30.48 + inches * 2.54); // Convert to cm
  }

  // Get weight in kg
  let weight;
  if (weightUnit === "kg") {
    weight = parseInt(document.getElementById("weight").value);
  } else {
    const lbs = parseInt(document.getElementById("weightLbs").value);
    weight = Math.round(lbs * 0.453592); // Convert to kg
  }

  const activityLevel = parseFloat(document.getElementById("activity").value);

  // Validate inputs
  if (!validateInputs(age, height, weight, activityLevel)) {
    return;
  }

  // Calculate BMR using Mifflin-St Jeor formula
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Calculate maintenance calories (TDEE)
  const maintenanceCalories = Math.round(bmr * activityLevel);

  // Calculate different weight loss scenarios
  const mildWeightLoss = Math.round(maintenanceCalories - 250);
  const normalWeightLoss = Math.round(maintenanceCalories - 500);
  const extremeWeightLoss = Math.round(maintenanceCalories - 1000);

  // Display results
  displayResults(
    maintenanceCalories,
    mildWeightLoss,
    normalWeightLoss,
    extremeWeightLoss
  );
});

// Validate inputs
function validateInputs(age, height, weight, activityLevel) {
  if (isNaN(age) || age < 1 || age > 120) {
    alert("Please enter a valid age between 1 and 120");
    return false;
  }

  if (isNaN(height) || height < 50 || height > 300) {
    alert("Please enter a valid height between 50 and 300 cm");
    return false;
  }

  if (isNaN(weight) || weight < 20 || weight > 500) {
    alert("Please enter a valid weight between 20 and 500 kg");
    return false;
  }

  if (isNaN(activityLevel)) {
    alert("Please select an activity level");
    return false;
  }

  return true;
}

// Display results
function displayResults(maintain, mild, normal, extreme) {
  // Update calorie values
  maintainElement.textContent = `${maintain} cal`;
  mildElement.textContent = `${mild} cal`;
  normalElement.textContent = `${normal} cal`;
  extremeElement.textContent = `${extreme} cal`;

  // Show results section with animation
  resultsSection.classList.remove("hidden");

  // Smooth scroll to results
  resultsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Add input validation on the fly
document.getElementById("age").addEventListener("input", function () {
  if (this.value < 0) this.value = 0;
  if (this.value > 120) this.value = 120;
});

document.getElementById("height").addEventListener("input", function () {
  if (this.value < 0) this.value = 0;
  if (this.value > 300) this.value = 300;
});

document.getElementById("weight").addEventListener("input", function () {
  if (this.value < 0) this.value = 0;
  if (this.value > 500) this.value = 500;
});

document.getElementById("heightFeet").addEventListener("input", function () {
  if (this.value < 0) this.value = 0;
  if (this.value > 9) this.value = 9;
});

document.getElementById("heightInches").addEventListener("input", function () {
  if (this.value < 0) this.value = 0;
  if (this.value > 11) this.value = 11;
});

document.getElementById("weightLbs").addEventListener("input", function () {
  if (this.value < 0) this.value = 0;
  if (this.value > 1100) this.value = 1100;
});
