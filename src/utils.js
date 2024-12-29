module.exports = {
    validateCredentials: (username, password) => {
      return username === 'admin' && password === 'password';
    },
  };