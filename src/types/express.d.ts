declare namespace Express {
  interface Request {
    user?: {
      id: string;
      username?: string;
      email?: string;
      role?: string;
      // Add other fields as needed
    };
  }
}