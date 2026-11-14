import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, MapPin, Lock, Plus, Trash2, Sparkles, ArrowRight } from 'lucide-react';

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
      setProfileMsg('Patron details updated with honour.');
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
        setPasswordMsg('Password security successfully updated.');
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
    <div className="min-h-screen bg-[#FFF9F2] py-12 sm:py-20 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D6B77A]/20 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
              <span>Patron Sanctuary</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] uppercase tracking-tight">
              Profile & <span className="font-serif italic font-normal lowercase text-[#790B13]">destinations</span>
            </h1>
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#790B13] bg-white border border-[#D6B77A]/40 px-5 py-2 rounded-full w-fit shadow-xs font-bold">
            {user?.email}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="bg-white p-3 rounded-3xl border border-[#D6B77A]/30 space-y-1.5 h-fit shadow-sm">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 text-xs font-mono uppercase tracking-wider font-bold ${
                activeTab === 'profile'
                  ? 'bg-[#790B13] text-[#FFF0DC] shadow-md'
                  : 'text-[#21191A]/70 hover:bg-[#FFF0DC]/40 hover:text-[#790B13]'
              }`}
            >
              <User className="w-4 h-4 text-[#D6B77A]" />
              <span>Personal Details</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between text-xs font-mono uppercase tracking-wider font-bold ${
                activeTab === 'addresses'
                  ? 'bg-[#790B13] text-[#FFF0DC] shadow-md'
                  : 'text-[#21191A]/70 hover:bg-[#FFF0DC]/40 hover:text-[#790B13]'
              }`}
            >
              <span className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#D6B77A]" />
                <span>Addresses</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-[#FFF0DC] text-[#790B13]'
              }`}>
                {addresses.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 text-xs font-mono uppercase tracking-wider font-bold ${
                activeTab === 'password'
                  ? 'bg-[#790B13] text-[#FFF0DC] shadow-md'
                  : 'text-[#21191A]/70 hover:bg-[#FFF0DC]/40 hover:text-[#790B13]'
              }`}
            >
              <Lock className="w-4 h-4 text-[#D6B77A]" />
              <span>Password</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#D6B77A]/30 space-y-6 shadow-sm">
                <h2 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight border-b border-[#D6B77A]/20 pb-4">
                  Personal Information
                </h2>

                {profileMsg && (
                  <div className="p-4 bg-[#FFF0DC] text-[#790B13] text-xs font-mono rounded-xl border border-[#D6B77A]/40 font-bold">
                    {profileMsg}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-5 text-xs font-sans">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                      Email Address (Account Identifier)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-[#FFF9F2]/50 border border-[#D6B77A]/20 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A]/50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98250 12345"
                      className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-8 py-4 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-md shadow-[#790B13]/25 active:scale-98 cursor-pointer flex items-center gap-2 group"
                    >
                      <span>Save Patron Details</span>
                      <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#D6B77A]/30 space-y-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-[#D6B77A]/20 pb-4">
                  <h2 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
                    Saved Delivery Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] text-xs font-mono uppercase tracking-wider font-bold px-5 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D6B77A]" />
                    <span>{showAddAddress ? 'Close Form' : 'Add New'}</span>
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddAddress && (
                  <form
                    onSubmit={handleAddAddress}
                    className="bg-[#FFF9F2] p-6 rounded-2xl border border-[#D6B77A]/30 space-y-4 text-xs"
                  >
                    <span className="font-heading font-black text-sm uppercase text-[#21191A] block">
                      New Address Entry
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, fullName: e.target.value })
                          }
                          className="w-full bg-white border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, phone: e.target.value })
                          }
                          className="w-full bg-white border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.addressLine1}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, addressLine1: e.target.value })
                        }
                        className="w-full bg-white border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                          className="w-full bg-white border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs text-[#21191A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, state: e.target.value })
                          }
                          className="w-full bg-white border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs text-[#21191A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">Pincode *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.pincode}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, pincode: e.target.value })
                          }
                          className="w-full bg-white border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs text-[#21191A]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold cursor-pointer shadow-xs"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-5 py-2.5 border border-[#D6B77A]/30 text-[#21191A]/70 rounded-full text-xs font-mono uppercase tracking-wider hover:bg-white cursor-pointer"
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
                      className="p-6 rounded-2xl border border-[#D6B77A]/30 bg-[#FFF9F2] flex flex-col justify-between hover:border-[#790B13]/40 transition-colors shadow-xs"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-heading font-black text-sm uppercase text-[#21191A]">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-mono bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] font-bold uppercase px-2.5 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#21191A]/70 leading-relaxed font-sans">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                          {addr.city}, {addr.state} - {addr.pincode}<br />
                          <span className="mt-2 block font-mono text-[#21191A] font-bold">Phone: {addr.phone}</span>
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#D6B77A]/20 mt-4 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-[#21191A]/50 hover:text-[#790B13] text-xs font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
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
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#D6B77A]/30 space-y-6 shadow-sm">
                <h2 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight border-b border-[#D6B77A]/20 pb-4">
                  Security & Password
                </h2>

                {passwordMsg && (
                  <div className="p-4 bg-[#FFF0DC] text-[#790B13] text-xs font-mono rounded-xl border border-[#D6B77A]/40 font-bold">
                    {passwordMsg}
                  </div>
                )}
                {passwordErr && (
                  <div className="p-4 bg-rose-50 text-rose-800 text-xs font-mono rounded-xl border border-rose-200 font-medium">
                    {passwordErr}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs font-sans">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                      New Password (min. 6 characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-8 py-4 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-md shadow-[#790B13]/25 active:scale-98 cursor-pointer"
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
