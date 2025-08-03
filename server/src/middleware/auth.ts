import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../utils/data-source";
import { User } from "../entities/User";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number };
    
    // Attach user to request object
    const userRepository = AppDataSource.getRepository(User);
    userRepository.findOne({ where: { id: decoded.userId } })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }
        
        req.user = {
          id: user.id,
          username: user.username,
          role: user.role
        };
        
        next();
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Error authenticating user' });
      });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function authorizeRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
    }
    next();
  };
}
