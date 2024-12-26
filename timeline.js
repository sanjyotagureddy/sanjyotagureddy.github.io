document.addEventListener('DOMContentLoaded', function () {
    const timelineHeaders = document.querySelectorAll('.custom-timeline-header');
    const modals = document.querySelectorAll('.custom-modal');
    const closeButtons = document.querySelectorAll('.custom-close-btn');

    // Open the modal when a timeline card is clicked
    timelineHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const cardNumber = this.getAttribute('data-card');
            const modal = document.getElementById('modal-' + cardNumber);
            modal.style.display = 'block';
        });
    });

    // Close the modal when the close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.custom-modal');
            modal.style.display = 'none';
        });
    });

    // Close the modal if the user clicks outside the modal content
    window.addEventListener('click', function (event) {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});
