const BusinessSettings = require('../models/BusinessSettings');

// @desc Get business settings (public)
// @route GET /api/settings
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create({});
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

// @desc Update business settings (Admin)
// @route PUT /api/settings
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = new BusinessSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Business settings updated successfully',
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Check if delivery pincode is serviceable
// @route GET /api/settings/check-pincode/:pincode
exports.checkPincode = async (req, res, next) => {
  try {
    const { pincode } = req.params;
    const settings = await BusinessSettings.findOne();

    const isRajkotLocal = pincode.startsWith('360');
    const isSupported = settings?.supportedPincodes?.includes(pincode) || isRajkotLocal;

    res.status(200).json({
      success: true,
      pincode,
      isServiceable: isSupported,
      isLocalRajkot: isRajkotLocal,
      deliveryMessage: isRajkotLocal
        ? 'Super-fast Rajkot local delivery available (same-day / within 4-8 hours).'
        : isSupported
        ? 'Standard courier delivery available across Gujarat & major Indian metros.'
        : 'Currently not on our standard delivery route, but customer pickup or special courier may be arranged.',
    });
  } catch (error) {
    next(error);
  }
};

