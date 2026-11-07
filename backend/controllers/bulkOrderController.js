const BulkOrder = require('../models/BulkOrder');

// @desc Submit bulk order enquiry
// @route POST /api/bulk-orders
exports.submitBulkOrder = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      eventType,
      approximateGuests,
      preferredSnacks,
      approximateQuantityKg,
      eventDate,
      deliveryAddress,
      city,
      pincode,
      notes,
    } = req.body;

    if (!name || !email || !phone || !approximateQuantityKg || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, phone, quantity in kg, and delivery address.',
      });
    }

    const bulkOrder = await BulkOrder.create({
      name,
      email,
      phone,
      eventType: eventType || 'Family Function',
      approximateGuests: Number(approximateGuests) || 50,
      preferredSnacks: preferredSnacks || [],
      approximateQuantityKg: Number(approximateQuantityKg),
      eventDate: eventDate ? new Date(eventDate) : undefined,
      deliveryAddress,
      city: city || 'Rajkot',
      pincode: pincode || '',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your bulk snacks enquiry! Our team will contact you within 4 business hours.',
      bulkOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all bulk enquiries (Admin)
// @route GET /api/bulk-orders
exports.getAllBulkOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const enquiries = await BulkOrder.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update bulk enquiry status (Admin)
// @route PUT /api/bulk-orders/:id/status
exports.updateBulkOrderStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const enquiry = await BulkOrder.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    if (status) enquiry.status = status;
    if (notes) enquiry.notes = notes;

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: 'Bulk order enquiry status updated',
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

