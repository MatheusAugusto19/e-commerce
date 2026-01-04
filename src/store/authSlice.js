const authSlice = (set, get) => ({
  user: null,
  isAuthenticated: false,

  _setUser: (userData) => {
    if (userData) {
      const { ...userWithoutPassword } = userData;
      set({ user: userWithoutPassword, isAuthenticated: true });
      localStorage.setItem("ecommerce_user", JSON.stringify(userWithoutPassword));
    } else {
      set({ user: null, isAuthenticated: false });
      localStorage.removeItem("ecommerce_user");
    }
  },

  // Simulating user database
  _getUserDatabase: () => {
    const stored = localStorage.getItem("ecommerce_users_db");
    return stored ? JSON.parse(stored) : [];
  },
  _saveUserDatabase: (users) => {
    localStorage.setItem("ecommerce_users_db", JSON.stringify(users));
  },

  initializeAuth: () => {
    const storedUser = localStorage.getItem("ecommerce_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        get()._setUser(user);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        get()._setUser(null);
      }
    }
  },

  register: (name, email, password) => {
    if (!name || !email || !password) throw new Error("Todos os campos são obrigatórios");
    if (password.length < 6) throw new Error("Senha deve ter no mínimo 6 caracteres");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email inválido");

    const users = get()._getUserDatabase();
    if (users.some(u => u.email === email)) throw new Error("Este email já está cadastrado");

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: btoa(password), // Demo only
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    get()._saveUserDatabase(users);
    get()._setUser(newUser);
    return newUser;
  },

  login: (email, password) => {
    if (!email || !password) throw new Error("Email e senha são obrigatórios");
    
    const users = get()._getUserDatabase();
    const foundUser = users.find(u => u.email === email);

    if (!foundUser || btoa(password) !== foundUser.password) {
      throw new Error("Email ou senha incorretos");
    }
    
    get()._setUser(foundUser);
    return foundUser;
  },

  logout: () => {
    get()._setUser(null);
  },
});

export default authSlice;
