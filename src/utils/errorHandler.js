function parseMongooseError(error) {
  if (typeof error === 'string') {
    // Handle duplicate key error string with parsing
    if (error.includes('E11000 duplicate key error')) {
      // Try parsing field and value from string
      const regex = /index: ([^ ]+) dup key: \{ ([^:]+): ?"([^"]+)" \}/i;
      const match = error.match(regex);

      if (match) {
        const field = match[2];
        const value = match[3];
        return `${capitalize(field)} "${value}" is already in use.`;
      }
      return 'Duplicate key error: A unique value already exists.';
    }

    // You can add more string error parsing here if needed

    return error; // Return string as is if no special handling
  }

  // If error is an object (Mongoose error object)
  if (error.code === 11000 && error.keyValue) {
    const duplicatedField = Object.keys(error.keyValue)[0];
    const duplicatedValue = error.keyValue[duplicatedField];
    return `${capitalize(duplicatedField)} "${duplicatedValue}" is already in use.`;
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return messages.join(', ');
  }

  if (error.name === 'CastError') {
    return `Invalid value for ${error.path}: "${error.value}"`;
  }

  console.log(error.message || error.toString())

  return error.message || error.toString();
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export default parseMongooseError;
