// Restaurant opening hours utility
// Monday-Thursday: 17:00-03:00
// Friday: 15:00-03:00
// Saturday-Sunday: 17:00-03:00

/**
 * Get opening hours for a specific day of the week
 * @param {Date} date - The date to check
 * @returns {Object} - { openTime: string (HH:mm), closeTime: string (HH:mm) }
 */
const getOpeningHours = (date) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Sunday (0) or Saturday (6)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      openTime: '17:00', // 17:00 (5:00pm)
      closeTime: '03:00' // 03:00 (3:00am next day)
    };
  }
  
  // Friday (5)
  if (dayOfWeek === 5) {
    return {
      openTime: '15:00', // 15:00 (3:00pm)
      closeTime: '03:00' // 03:00 (3:00am next day)
    };
  }
  
  // Monday (1) - Thursday (4)
  return {
    openTime: '17:00', // 17:00 (5:00pm)
    closeTime: '03:00' // 03:00 (3:00am next day)
  };
};

/**
 * Check if a time is within opening hours for a given date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} timeString - Time in HH:mm format
 * @returns {boolean} - True if time is within opening hours
 */
const isWithinOpeningHours = (dateString, timeString) => {
  const date = new Date(dateString);
  const hours = getOpeningHours(date);
  const [openHour, openMin] = hours.openTime.split(':').map(Number);
  const [closeHour, closeMin] = hours.closeTime.split(':').map(Number);
  const [timeHour, timeMin] = timeString.split(':').map(Number);
  
  // Since closing time is 3:00am (next day), we need to handle the overnight case
  if (closeHour < openHour) {
    // Overnight hours (e.g., 5pm to 3am next day)
    // Valid times are: >= openTime OR < closeTime
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    const timeMinutes = timeHour * 60 + timeMin;
    
    return timeMinutes >= openMinutes || timeMinutes < closeMinutes;
  } else {
    // Normal hours (same day)
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    const timeMinutes = timeHour * 60 + timeMin;
    
    return timeMinutes >= openMinutes && timeMinutes < closeMinutes;
  }
};

/**
 * Get formatted opening hours message for error display
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} - Formatted opening hours message
 */
const getOpeningHoursMessage = (dateString) => {
  const date = new Date(dateString);
  const hours = getOpeningHours(date);
  const dayOfWeek = date.getDay();
  
  let dayName = '';
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    dayName = 'Weekend (Sat-Sun)';
  } else if (dayOfWeek === 5) {
    dayName = 'Friday';
  } else {
    dayName = 'Weekday (Mon-Thu)';
  }
  
  const openTime12 = convertTo12Hour(hours.openTime);
  const closeTime12 = convertTo12Hour(hours.closeTime);
  
  return `${dayName}: ${openTime12} - ${closeTime12}`;
};

/**
 * Convert 24-hour time to 12-hour format
 * @param {string} time24 - Time in HH:mm format
 * @returns {string} - Time in 12-hour format (e.g., "5:00pm")
 */
const convertTo12Hour = (time24) => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')}${period}`;
};

module.exports = {
  isWithinOpeningHours,
  getOpeningHoursMessage,
  getOpeningHours
};

