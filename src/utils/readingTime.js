export const calculateReadingTime = (content, existingReadTime = null) => {
  // If readTime is provided and valid, use it
  if (existingReadTime && existingReadTime.trim() !== '') {
    const minutes = parseInt(existingReadTime);
    if (!isNaN(minutes) && minutes > 0) {
      return {
        minutes,
        display: `${minutes} min read`,
        schema: `PT${minutes}M`
      };
    }
  }

  // Calculate from content (average reading speed: 200 words per minute)
  if (content) {
    // Remove HTML tags and calculate word count
    const textContent = content.replace(/<[^>]*>/g, ' ');
    const wordCount = textContent.split(/\s+/).filter((word) => word.length > 0).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200)); // At least 1 minute

    return {
      minutes,
      display: `${minutes} min read`,
      schema: `PT${minutes}M`
    };
  }

  // Default fallback
  return {
    minutes: 3,
    display: '3 min read',
    schema: 'PT3M'
  };
};
