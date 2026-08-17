import { Response, NextFunction } from 'express';
import { Customer } from '../models/Customer';
import { Ticket } from '../models/Ticket';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getCustomers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, company } = req.query;
    const filter: any = { organizationId: req.user?.organizationId };

    if (company) filter.company = company;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(filter).sort({ updatedAt: -1 });

    // Attach ticket counts dynamically
    const formatted = await Promise.all(
      customers.map(async (c) => {
        const ticketCount = await Ticket.countDocuments({ customerId: c.userId || c._id });
        const lastTicket = await Ticket.findOne({ customerId: c.userId || c._id }).sort({ createdAt: -1 });
        return {
          ...c.toObject(),
          ticketCount,
          lastInteraction: lastTicket ? lastTicket.createdAt : c.updatedAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: formatted.length,
      customers: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      throw new AppError('Customer profile not found', 404);
    }

    const tickets = await Ticket.find({ customerId: customer.userId || customer._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      customer,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomerNotes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes, tags } = req.body;

    const customer = await Customer.findById(id);
    if (!customer) throw new AppError('Customer profile not found', 404);

    if (notes !== undefined) customer.notes = notes;
    if (tags !== undefined) customer.tags = tags;

    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Customer notes updated successfully',
      customer,
    });
  } catch (error) {
    next(error);
  }
};
