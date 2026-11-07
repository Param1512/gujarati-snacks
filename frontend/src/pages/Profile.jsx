import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, MapPin, Lock, Plus, Trash2, Sparkles } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: 'Rajkot',
    state: 'Gujarat',
    pincode: '360005',
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/auth/addresses');
      if (res.success) setAddresses(res.addresses);
    } catch (e) {}
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      await updateProfile({ name, phone });
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      setProfileMsg('Failed: ' + err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (res.success) {
        setPasswordMsg('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setPasswordErr(err.message || 'Failed to change password');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/addresses', newAddress);
      if (res.success) {
        setShowAddAddress(false);
        fetchAddresses();
        setNewAddress({
          fullName: user?.name || '',
          phone: user?.phone || '',
          addressLine1: '',
          addressLine2: '',
          landmark: '',
          city: 'Rajkot',
          state: 'Gujarat',
          pincode: '360005',
          isDefault: false,
        });
      }
    } catch (e) {
      alert('Error adding address: ' + e.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this saved address?')) return;
    try {
      await api.delete(`/auth/addresses/${id}`);
      fetchAddresses();
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-16 text-[#000000]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAE3D9] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
              <span>Customer Account</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#000000] tracking-tight">
              Profile & Addresses
            </h1>
          </div>
          <span className="text-xs font-bold text-[#000000] bg-white border border-[#EAE3D9] px-4 py-1.5 rounded-full w-fit">
            {user?.email}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="bg-white p-3 rounded-3xl border border-[#EAE3D9] space-y-1 h-fit shadow-sm">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-2.5 text-xs font-semibold ${
                activeTab === 'profile'
                  ? 'bg-[#000000] text-[#14382B] font-bold shadow-xs'
                  : 'text-[#555555] hover:bg-[#FAF7F2] hover:text-[#000000]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Details</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between text-xs font-semibold ${
                activeTab === 'addresses'
                  ? 'bg-[#000000] text-[#14382B] font-bold shadow-xs'
                  : 'text-[#555555] hover:bg-[#FAF7F2] hover:text-[#000000]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Addresses</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'addresses' ? 'bg-[#14382B]/20 text-[#14382B]' : 'bg-[#EBF4EF] text-[#000000]'
              }`}>
                {addresses.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-2.5 text-xs font-semibold ${
                activeTab === 'password'
                  ? 'bg-[#000000] text-[#14382B] font-bold shadow-xs'
                  : 'text-[#555555] hover:bg-[#FAF7F2] hover:text-[#000000]'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Password</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] space-y-6 shadow-sm">
                <h2 className="font-heading font-black text-lg text-[#000000] border-b border-[#EAE3D9] pb-3">
                  Personal Information
                </h2>

                {profileMsg && (
                  <div className="p-3.5 bg-[#EBF4EF] text-[#000000] text-xs sm:text-sm rounded-2xl border border-[#14382B]/60 font-medium">
                    {profileMsg}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs sm:text-sm font-sans">
                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                      Email Address (Account Identifier)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-[#FAF7F2]/50 border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#555555] cursor-not-allowed opacity-80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98250 12345"
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#C84B20] hover:bg-[#A33A16] text-white px-7 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#C84B20]/25 active:scale-98 cursor-pointer"
                    >
                      Save Profile Details
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] space-y-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-[#EAE3D9] pb-3">
                  <h2 className="font-heading font-black text-lg text-[#000000]">
                    Saved Delivery Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="bg-[#000000] hover:bg-[#1a1a1a] text-[#14382B] text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddAddress ? 'Close Form' : 'Add New'}</span>
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddAddress && (
                  <form
                    onSubmit={handleAddAddress}
                    className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#EAE3D9] space-y-4 text-xs sm:text-sm"
                  >
                    <span className="font-heading font-black text-sm text-[#000000] block">
                      New Address Entry
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#555555] mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, fullName: e.target.value })
                          }
                          className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#555555] mb-1">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, phone: e.target.value })
                          }
                          className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.addressLine1}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, addressLine1: e.target.value })
                        }
                        className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#555555] mb-1">City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                          className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#000000]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#555555] mb-1">State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, state: e.target.value })
                          }
                          className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#000000]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#555555] mb-1">Pincode *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.pincode}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, pincode: e.target.value })
                          }
                          className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#000000]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="bg-[#000000] hover:bg-[#1a1a1a] text-[#14382B] px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-4 py-2.5 border border-[#EAE3D9] text-[#555555] rounded-full text-xs font-semibold hover:bg-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Address Cards List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="p-5 rounded-2xl border border-[#EAE3D9] bg-[#FAF7F2] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-heading font-bold text-sm text-[#000000]">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-[#14382B] text-[#000000] font-bold uppercase px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#555555] leading-relaxed font-sans">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                          {addr.city}, {addr.state} - {addr.pincode}<br />
                          <span className="mt-1 block font-medium text-[#000000]">Phone: {addr.phone}</span>
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#EAE3D9] mt-3 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-[#555555] hover:text-[#C84B20] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] space-y-6 shadow-sm">
                <h2 className="font-heading font-black text-lg text-[#000000] border-b border-[#EAE3D9] pb-3">
                  Change Password
                </h2>

                {passwordMsg && (
                  <div className="p-3.5 bg-[#EBF4EF] text-[#000000] text-xs sm:text-sm rounded-2xl border border-[#14382B]/60 font-medium">
                    {passwordMsg}
                  </div>
                )}
                {passwordErr && (
                  <div className="p-3.5 bg-rose-50 text-rose-800 text-xs sm:text-sm rounded-2xl border border-rose-200 font-medium">
                    {passwordErr}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs sm:text-sm font-sans">
                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                      New Password (min. 6 characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#C84B20] hover:bg-[#A33A16] text-white px-7 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#C84B20]/25 active:scale-98 cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
