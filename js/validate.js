$(document).ready(function () {
  // Toggle Payment Sections
  $('input[name="paymentMethod"]').change(function () {
    if ($('#creditCardRadio').is(':checked')) {
      $('#card-section').show();
      $('#upi-section').hide();
    } else {
      $('#card-section').hide();
      $('#upi-section').show();
    }
  }).trigger('change');

  // Allow only digits in specific fields
  $('#phone, #cardNumber, #cvv, #expMonth, #pincode').on('input', function () {
    this.value = this.value.replace(/\D/g, '');
  });

  // Format Expiration Date (MM/YY)
  $('#expDate').on('input', function () {
    let value = this.value.replace(/[^\d]/g, '');
    if (value.length >= 3) {
      this.value = value.slice(0, 2) + '/' + value.slice(2, 4);
    } else {
      this.value = value;
    }
  });

  // jQuery Validate custom rule for MM/YY
  $.validator.addMethod("mmYY", function (value, element) {
    return this.optional(element) || /^\d{2}\/\d{2}$/.test(value);
  }, "Use format MM/YY");

  // Initialize validation
  $('#checkout-form').validate({
    rules: {
      firstName: {
        required: true,
        minlength: 2
      },
      lastName: {
        required: true,
        minlength: 2
      },
      phone: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10
      },
      email: {
        required: true,
        email: true
      },
      address: {
        required: true,
        minlength: 5
      },
      country: "required",
      state: "required",
      pincode: {
        required: true,
        digits: true,
        minlength: 6,
        maxlength: 6
      },

      // Conditional UPI
      upiId: {
        required: function () {
          return $('#upiRadio').is(':checked');
        },
        minlength: 5
      },

      // Conditional Credit Card
      cardNumber: {
        required: function () {
          return $('#creditCardRadio').is(':checked');
        },
        digits: true,
        minlength: 16,
        maxlength: 16
      },
      cardHolder: {
        required: function () {
          return $('#creditCardRadio').is(':checked');
        },
        minlength: 3
      },
      expDate: {
        required: function () {
          return $('#creditCardRadio').is(':checked');
        },
        mmYY: true
      },
      expMonth: {
        required: function () {
          return $('#creditCardRadio').is(':checked');
        },
        digits: true,
        min: 1,
        max: 12
      },
      cvv: {
        required: function () {
          return $('#creditCardRadio').is(':checked');
        },
        digits: true,
        minlength: 3,
        maxlength: 4
      }
    },

    messages: {
      firstName: {
        required: "First name is required",
        minlength: "At least 2 characters"
      },
      lastName: {
        required: "Last name is required",
        minlength: "At least 2 characters"
      },
      phone: {
        required: "Phone is required",
        digits: "Enter a valid number",
        minlength: "Must be 10 digits",
        maxlength: "Must be 10 digits"
      },
      email: {
        required: "Email is required",
        email: "Enter a valid email"
      },
      address: {
        required: "Address is required",
        minlength: "Minimum 5 characters"
      },
      country: "Country is required",
      state: "State is required",
      pincode: {
        required: "Pincode is required",
        digits: "Only numbers allowed",
        minlength: "Must be 6 digits",
        maxlength: "Must be 6 digits"
      },
      upiId: {
        required: "UPI ID is required",
        minlength: "Minimum 5 characters"
      },
      cardNumber: {
        required: "Card number is required",
        digits: "Only digits allowed",
        minlength: "Must be 16 digits",
        maxlength: "Must be 16 digits"
      },
      cardHolder: {
        required: "Card holder name is required",
        minlength: "Minimum 3 characters"
      },
      expDate: {
        required: "Expiration date required",
        mmYY: "Use format MM/YY"
      },
      expMonth: {
        required: "Expiration month required",
        min: "Month must be between 1 and 12",
        max: "Month must be between 1 and 12"
      },
      cvv: {
        required: "CVV is required",
        digits: "Only digits allowed",
        minlength: "3-4 digits only",
        maxlength: "3-4 digits only"
      }
    },

    errorElement: "div",
    errorClass: "error",
    submitHandler: function (form) {
      alert("Form is valid. Submitting...");
      form.submit();
    }
  });
});