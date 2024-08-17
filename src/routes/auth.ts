import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../models/User';

const router = express.Router();

router.post('/register', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, dateOfBirth, address, nationality, contactNumber, email, password, role } = req.body;

  try {
      let user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
          firstName,
          lastName,
          dateOfBirth,
          address,
          nationality,
          contactNumber,
          email,
          password,
          role
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
          user: {
              id: user.id,
              role: user.role
          }
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

      res.status(201).json({ token });
  } catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
        res.status(500).send('Server error');
    } else {
        console.error('Unknown error:', err);
        res.status(500).send('Server error');
    }
  }
});

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = {
          user: {
              id: user.id,
              role: user.role
          }
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

      res.json({ token });
  } catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
        res.status(500).send('Server error');
    } else {
        console.error('Unknown error:', err);
        res.status(500).send('Server error');
    }
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ msg: 'No user with that email' });
      }

      // Implement email sending logic with reset link (not included in this example)

      res.json({ msg: 'Password reset email sent' });
  } catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
        res.status(500).send('Server error');
    } else {
        console.error('Unknown error:', err);
        res.status(500).send('Server error');
    }
  }
});

// Reset Password Route
router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
      // Verify token (details skipped for brevity)
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      const user = await User.findById(decoded.user.id);

      if (!user) {
          return res.status(400).json({ msg: 'Invalid token' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.json({ msg: 'Password reset successful' });
  } catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
        res.status(500).send('Server error');
    } else {
        console.error('Unknown error:', err);
        res.status(500).send('Server error');
    }
  }
});

export default router;