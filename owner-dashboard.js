// Tab switching functionality
function changeTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  // Deactivate all sidebar links
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show the selected tab content
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Activate the selected sidebar link
  const selectedLink = document.querySelector(`.sidebar-link[href="#${tabName}"]`);
  if (selectedLink) {
    selectedLink.classList.add('active');
  }

  // Update URL hash
  window.location.hash = tabName;

  // Initialize charts/calendars if they are in the active tab and not already initialized
  if (tabName === 'dashboard') {
    initializeDashboardCharts();
    initializeDashboardCalendar();
  } else if (tabName === 'earnings') {
    initializeEarningsChart();
  } else if (tabName === 'availability') {
    initializeAvailabilityCalendar();
  }
}

// Dropdown toggle for notifications
function toggleNotifications() {
  document.getElementById('notificationDropdown').classList.toggle('show');
  // Close profile dropdown if open
  const profileDropdown = document.getElementById('profileDropdown');
  if (profileDropdown.classList.contains('show')) {
    profileDropdown.classList.remove('show');
  }
}

// Dropdown toggle for profile
function toggleProfile() {
  document.getElementById('profileDropdown').classList.toggle('show');
  // Close notification dropdown if open
  const notificationDropdown = document.getElementById('notificationDropdown');
  if (notificationDropdown.classList.contains('show')) {
    notificationDropdown.classList.remove('show');
  }
}

// Close dropdowns if clicked outside
window.onclick = function(event) {
  if (!event.target.matches('.relative button, .relative button *, .dropdown-content, .dropdown-content *')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// Chart.js Initializations
let earningsChartInstance = null;
let monthlyEarningsChartInstance = null;

function initializeDashboardCharts() {
  const earningsChartCtx = document.getElementById('earningsChart')?.getContext('2d');
  if (earningsChartCtx && !earningsChartInstance) {
    earningsChartInstance = new Chart(earningsChartCtx, {
      type: 'doughnut',
      data: {
        labels: ['Bookings', 'Add-ons', 'Cleaning Fees'],
        datasets: [{
          label: 'Earnings Breakdown',
          data: [2800, 300, 150],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }
    });
  }
}

function initializeEarningsChart() {
  const monthlyEarningsChartCtx = document.getElementById('monthlyEarningsChart')?.getContext('2d');
  if (monthlyEarningsChartCtx && !monthlyEarningsChartInstance) {
    monthlyEarningsChartInstance = new Chart(monthlyEarningsChartCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Net Earnings',
          data: [1200, 1900, 3000, 2500, 4200, 3800, 2762.50],
          borderColor: '#ff6b35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) { return '$' + value; }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}


// FullCalendar Initializations
let dashboardCalendarInstance = null;
let availabilityCalendarInstance = null;

function initializeDashboardCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (calendarEl && !dashboardCalendarInstance) {
    dashboardCalendarInstance = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      },
      events: [
        { title: 'Booking: Chef John', start: '2023-07-05T09:00:00', end: '2023-07-05T15:00:00', classNames: ['calendar-event-booked'] },
        { title: 'Booking: Chef Maria', start: '2023-07-02T14:00:00', end: '2023-07-02T20:00:00', classNames: ['calendar-event-booked'] },
        { title: 'Pending: Chef Alex', start: '2023-07-15T09:00:00', end: '2023-07-15T15:00:00', classNames: ['calendar-event-pending'] },
        { title: 'Blocked: Maintenance', start: '2023-07-22', end: '2023-07-24', classNames: ['calendar-event-blocked'], display: 'background' }
      ],
      eventDidMount: function(info) {
        // You can add tooltips or custom rendering here if needed
      }
    });
    dashboardCalendarInstance.render();
  }
}

function initializeAvailabilityCalendar() {
  const availabilityCalendarEl = document.getElementById('availabilityCalendar');
  if (availabilityCalendarEl && !availabilityCalendarInstance) {
    availabilityCalendarInstance = new FullCalendar.Calendar(availabilityCalendarEl, {
      initialView: 'dayGridMonth',
      selectable: true,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      },
      events: [
        // Example events - these should be dynamically loaded
        { start: '2023-07-04', display: 'background', classNames: ['calendar-event-blocked'] }, // Blocked
        { start: '2023-07-05', end: '2023-07-06', display: 'background', classNames: ['calendar-event-booked'] }, // Booked
        { start: '2023-07-10', display: 'background', classNames: ['calendar-event-available'] }, // Available
        { start: '2023-07-15', display: 'background', classNames: ['calendar-event-pending'] } // Pending
      ],
      dateClick: function(info) {
        // Handle date click, e.g., for blocking/unblocking
        console.log('Date clicked: ' + info.dateStr);
        // Example: toggle availability (very basic)
        const existingEvent = availabilityCalendarInstance.getEvents().find(e => e.startStr === info.dateStr && e.display === 'background');
        if (existingEvent) {
          existingEvent.remove();
        } else {
          availabilityCalendarInstance.addEvent({
            start: info.dateStr,
            display: 'background',
            classNames: ['calendar-event-available'] // Default to available
          });
        }
      },
      select: function(info) {
        // Handle date range selection
        console.log('Selected from ' + info.startStr + ' to ' + info.endStr);
      }
    });
    availabilityCalendarInstance.render();
  }
}


// Initial tab setup based on URL hash or default to dashboard
document.addEventListener('DOMContentLoaded', function() {
  const hash = window.location.hash.substring(1);
  if (hash) {
    changeTab(hash);
  } else {
    changeTab('dashboard'); // Default tab
  }

  // Add event listeners for FAQ accordions
  const faqButtons = document.querySelectorAll('#support .border.rounded-lg button');
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      const icon = button.querySelector('i');
      if (content) {
        // Simple toggle, for more advanced accordion, manage open states
        if (content.style.display === 'block') {
          content.style.display = 'none';
          icon.classList.remove('fa-chevron-up');
          icon.classList.add('fa-chevron-down');
        } else {
          content.style.display = 'block';
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-up');
        }
      }
    });
  });
});
