import React, { useState, useEffect, useRef } from 'react';
import { MdDashboard, MdOutlineLink, MdAddLink, MdCreate, MdLock, MdLocalFireDepartment, MdQrCode2, MdAnalytics, MdSettings, MdLogout, MdContentCopy, MdEdit, MdDelete, MdBarChart, MdPieChart, MdLanguage, MdClose, MdCloudDownload, MdMenu } from 'https://esm.sh/react-icons/md';
import { FaUserCircle, FaKey, FaTrash, FaUserEdit } from 'https://esm.sh/react-icons/fa';
import { motion } from "framer-motion";


import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';


// Toast Component: Displays a temporary notification to the user.
const Toast = ({ message, type, onClose }) => {
    // Define CSS classes based on the toast type for styling
    const toastClasses = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer); 
    }, [onClose]);

    return (
        <div className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg text-white ${toastClasses[type]} flex items-center space-x-2 z-50`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
                <MdClose className="text-xl" />
            </button>
        </div>
    );
};

// DashboardOverviewContent Component: Displays key statistics for the user's links.
const DashboardOverviewContent = ({ user, API_BASE_URL }) => {
    const [stats, setStats] = useState({
        totalLinks: 0,
        totalClicks: 0,
        activeLinks: 0,
    });
    const [loading, setLoading] = useState(true);

    // Fetch dashboard summary data on component mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/url/analytics/summary`, {
                    credentials: 'include' 
                });
                if (!response.ok) {
                    throw new Error('Could not fetch dashboard data.');
                }
                const data = await response.json();
                setStats({
                    totalLinks: data.totalLinks,
                    totalClicks: data.totalClicks,
                    activeLinks: data.activeLinks
                });
            } catch (error) {
                console.error(error); 
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [API_BASE_URL]);

    // Data for displaying statistics in cards
    const displayStats = [
        {
            title: "Total Links",
            value: stats.totalLinks,
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-800",
        },
        {
            title: "Total Clicks",
            value: stats.totalClicks.toLocaleString(), 
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-800",
        },
        {
            title: "Active Links",
            value: stats.activeLinks,
            bg: "bg-purple-50",
            border: "border-purple-200",
            text: "text-purple-800",
        },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <div className="text-center mb-8">
                <motion.h1
                    className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Welcome, {user?.name}!
                </motion.h1>
                <p className="mt-2 text-sm md:text-base text-gray-500">
                    Glad to see you back on your dashboard 🎉
                </p>
            </div>

            <p className="text-gray-700 text-center mb-6">
                Here's a quick overview of your activity:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayStats.map((stat, index) => (
                    <motion.div
                        key={index}
                        className={`p-4 rounded-xl border shadow-sm ${stat.bg} ${stat.border} ${stat.text}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                        <h3 className="text-lg font-medium mb-2">{stat.title}</h3>
                        <p className="text-3xl font-bold">{loading ? '...' : stat.value}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};


// MyUrlsContent Component: Displays user's shortened URLs with search and filter.
const MyUrlsContent = ({ openQrModal, showToast, API_BASE_URL, openProtectedLinkModal, setCurrentPage }) => {
    const [userUrls, setUserUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Types');
    const [currentPage, setCurrentPageInternal] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Function to fetch URLs based on current filters and pagination
    useEffect(() => {
        const fetchUserUrls = async () => {
            try {
                setLoading(true);
                setError(null);

                const queryParams = new URLSearchParams({
                    page: currentPage,
                    search: searchTerm,
                    type: filterType === 'All Types' ? '' : filterType,
                });

                const response = await fetch(`${API_BASE_URL}/api/url/my-urls?${queryParams.toString()}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch URLs.');
                }

                const data = await response.json();
                setUserUrls(data.urls);
                setTotalPages(data.totalPages);
                setCurrentPageInternal(data.currentPage);

            } catch (err) {
                setError(err.message);
                showToast(err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        // Debounce fetching URLs to avoid excessive API calls while typing
        const debounceFetch = setTimeout(() => {
            fetchUserUrls();
        }, 500); 

        return () => clearTimeout(debounceFetch); 
    }, [API_BASE_URL, showToast, currentPage, searchTerm, filterType]); 
    // Function to handle copying short URL to clipboard
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!', 'success'));
    };

    // Function to handle deleting a URL
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/url/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                showToast(data.message || 'URL deleted successfully.', 'success');
                setUserUrls((prevUrls) => prevUrls.filter((url) => url._id !== id));
            } else {
                showToast(data.message || 'Failed to delete URL.', 'error');
            }
        } catch (error) {
            showToast('Something went wrong while deleting the URL.', 'error');
        }
    };

    // Function to navigate to analytics page for a specific URL (kept for consistency)
    const handleViewAnalytics = (id) => {
        setCurrentPage('Analytics');
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Shortened URLs</h2>
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
                <input
                    type="text"
                    placeholder="Filter URLs..."
                    className="p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none w-full sm:w-auto flex-grow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none w-full sm:w-auto"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="All Types">All Types</option>
                    {/* Changed 'Standard' to 'Default (Auto-Generated)' */}
                    <option value="standard">Default (Auto-Generated)</option>
                    <option value="protected">Protected</option>
                    <option value="fire">Fire</option>
                    <option value="location">Location Based</option>
                    <option value="custom">Custom Alias</option> {/* Added Custom Alias filter option */}
                </select>
            </div>
            {/* URLs Table */}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Link</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Link</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                    ) : error ? (
                        <tr><td colSpan="5" className="text-center py-4 text-red-500">{error}</td></tr>
                    ) : userUrls.length > 0 ? (
                        userUrls.map((url) => (
                            <tr key={url._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                                    <a href={`${API_BASE_URL}/${url.short_url}`} target="_blank" rel="noopener noreferrer">
                                        {`${API_BASE_URL.replace('http://', '')}/${url.short_url}`}
                                    </a>
                                    {url.password && <MdLock className="inline-block ml-2 text-yellow-600" title="Protected" />}
                                    {url.expiresAt && <MdLocalFireDepartment className="inline-block ml-2 text-red-600" title="Fire Link" />}
                                    {url.geo_rules && url.geo_rules.length > 0 && <MdLanguage className="inline-block ml-2 text-blue-600" title="Geo-Targeted" />}
                                </td>
                                <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-500" title={url.full_url}>
                                    {url.full_url}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{url.clicks}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(url.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => handleCopy(`${API_BASE_URL}/${url.short_url}`)} className="text-gray-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100" title="Copy"><MdContentCopy className="text-xl" /></button>
                                        <button onClick={() => openQrModal(`${API_BASE_URL}/${url.short_url}`)} className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-gray-100" title="QR Code"><MdQrCode2 className="text-xl" /></button>
                                        <button onClick={() => handleViewAnalytics(url._id)} className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-gray-100" title="Analytics"><MdAnalytics className="text-xl" /></button>
                                        <button onClick={() => handleDelete(url._id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-gray-100" title="Delete"><MdDelete className="text-xl" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No URLs found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPageInternal(p => p - 1)}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPageInternal(p => p + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

// CreateShortLinkContent Component: Form for creating a default short URL.
const CreateShortLinkContent = ({ openQrModal, showToast, API_BASE_URL }) => {
    const [longUrl, setLongUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [generatedQrCodeDataUrl, setGeneratedQrCodeDataUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!longUrl) {
            showToast('Please enter a long URL.', 'error');
            return;
        }
        setLoading(true);
        setShortenedUrl('');
        setGeneratedQrCodeDataUrl('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/url/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullUrl: longUrl,
                    type: 'standard', 
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setShortenedUrl(data.shortUrl);
                setGeneratedQrCodeDataUrl(data.qrCodeDataUrl);
                showToast(data.message || 'Default URL shortened successfully!', 'success');
                setLongUrl('');
            } else {
                showToast(data.message || 'Failed to shorten URL. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
            showToast('An unexpected error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Default Short URL</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-2">Long URL</label>
                    <input
                        type="url"
                        id="longUrl"
                        placeholder="e.g., https://very-long-and-complicated-url.com/some/path/to/resource"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center pt-4 space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            if (generatedQrCodeDataUrl) {
                                openQrModal(generatedQrCodeDataUrl);
                            } else if (shortenedUrl) {
                                openQrModal(shortenedUrl);
                            } else {
                                showToast('Please shorten a URL first to preview its QR Code.', 'info');
                            }
                        }}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                        disabled={loading}
                    >
                        <MdQrCode2 className="mr-2 text-lg" />
                        Preview QR Code
                    </button>
                    <button
                        type="submit"
                        className="ml-auto flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                        disabled={loading}
                    >
                        {loading ? 'Shortening...' : 'Shorten URL'}
                    </button>
                </div>
                {shortenedUrl && (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-green-800 shadow-sm flex items-center justify-between flex-wrap">
                        <p className="font-medium mr-4">Shortened URL:</p>
                        <a href={`${shortenedUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline break-all">
                            {shortenedUrl}
                        </a>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${shortenedUrl}`);
                                showToast('Short URL copied!', 'success');
                            }}
                            className="ml-4 p-2 rounded-full hover:bg-green-100 transition-colors"
                            title="Copy Short URL"
                        >
                            <MdContentCopy className="text-xl" />
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};


// CustomAliasContent Component: Form for creating a custom alias short URL.
const CustomAliasContent = ({ showToast, API_BASE_URL }) => {
    const [longUrl, setLongUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!longUrl) {
            showToast('Please enter a long URL.', 'error');
            return;
        }

        if (!customAlias.trim()) {
            showToast('Custom alias is required.', 'error');
            return;
        }

        setLoading(true);
        setShortenedUrl('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/url/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullUrl: longUrl,
                    customAlias: customAlias, 
                    type: 'custom', 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setShortenedUrl(data.shortUrl);
                showToast(data.message || 'URL successfully shortened! You can now view it in My URLs.', 'success');
                setLongUrl('');
                setCustomAlias('');
            } else {
                showToast(data.message || 'Failed to shorten URL. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
            showToast('An unexpected error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Custom Short URL</h2>
            <p className="text-gray-700 mb-6">Create and manage personalized short links for your URLs.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-2">Long URL</label>
                    <input
                        type="url"
                        id="longUrl"
                        placeholder="e.g., https://very-long-and-complicated-url.com/some/path/to/resource"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="customAliasInput" className="block text-sm font-medium text-gray-700 mb-2">Custom Alias</label>
                    <div className="flex rounded-xl shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            shrinkx.com/
                        </span>
                        <input
                            type="text"
                            id="customAliasInput"
                            placeholder="your-custom-alias"
                            className="flex-1 block w-full p-3 border border-gray-300 rounded-r-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                            required 
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Only letters, numbers, hyphens, and underscores are allowed.</p>
                </div>

                <div className="flex items-center pt-4">
                    <button
                        type="submit"
                        className="flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                        disabled={loading}
                    >
                        {loading ? 'Shortening...' : 'Shorten Custom URL'}
                    </button>
                </div>

                {shortenedUrl && (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-green-800 shadow-sm flex items-center justify-between flex-wrap">
                        <p className="font-medium mr-4">Shortened URL:</p>
                        <a href={`${shortenedUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline break-all">
                            {shortenedUrl}
                        </a>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${shortenedUrl}`);
                                showToast('Short URL copied!', 'success');
                            }}
                            className="ml-4 p-2 rounded-full hover:bg-green-100 transition-colors"
                            title="Copy Short URL"
                        >
                            <MdContentCopy className="text-xl" />
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};


// ProtectedLinksContent Component: Form for creating a password-protected short URL.
const ProtectedLinksContent = ({ openQrModal, showToast, API_BASE_URL }) => {
    const [longUrl, setLongUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [password, setPassword] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [generatedQrCodeDataUrl, setGeneratedQrCodeDataUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!longUrl || !password) {
            showToast('Please enter a long URL and a password.', 'error');
            return;
        }

        setLoading(true);
        setShortenedUrl('');
        setGeneratedQrCodeDataUrl('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/url/protected-shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullUrl: longUrl,
                    customAlias: customAlias.trim() === '' ? null : customAlias,
                    password: password,
                    type: 'protected', 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setShortenedUrl(data.shortUrl);
                setGeneratedQrCodeDataUrl(data.qrCodeDataUrl);
                showToast(data.message || 'Protected URL shortened successfully!', 'success');
                setLongUrl('');
                setCustomAlias('');
                setPassword('');
            } else {
                showToast(data.message || 'Failed to create protected URL. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error creating protected URL:', error);
            showToast('An unexpected error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Protected Link</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="protectedLongUrl" className="block text-sm font-medium text-gray-700 mb-2">Long URL</label>
                    <input
                        type="url"
                        id="protectedLongUrl"
                        placeholder="e.g., https://secret-document.com"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="protectedCustomAlias" className="block text-sm font-medium text-gray-700 mb-2">Custom Alias (Optional)</label>
                    <div className="flex rounded-xl shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            shrinkx.com/
                        </span>
                        <input
                            type="text"
                            id="protectedCustomAlias"
                            placeholder="your-secret-alias"
                            className="flex-1 block w-full p-3 border border-gray-300 rounded-r-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="protectedPassword" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        id="protectedPassword"
                        placeholder="Enter password for this link"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center pt-4 space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            if (generatedQrCodeDataUrl) {
                                openQrModal(generatedQrCodeDataUrl);
                            } else if (shortenedUrl) {
                                openQrModal(shortenedUrl);
                            } else {
                                showToast('Please shorten a URL first to preview its QR Code.', 'info');
                            }
                        }}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                        disabled={loading}
                    >
                        <MdQrCode2 className="mr-2 text-lg" />
                        Preview QR Code
                    </button>
                    <button
                        type="submit"
                        className="ml-auto flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Protected URL'}
                    </button>
                </div>

                {shortenedUrl && (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-green-800 shadow-sm flex items-center justify-between flex-wrap">
                        <p className="font-medium mr-4">Shortened URL:</p>
                        <a href={`${shortenedUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline break-all">
                            {shortenedUrl}
                        </a>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${shortenedUrl}`);
                                showToast('Short URL copied!', 'success');
                            }}
                            className="ml-4 p-2 rounded-full hover:bg-green-100 transition-colors"
                            title="Copy Short URL"
                        >
                            <MdContentCopy className="text-xl" />
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};


// FireLinksContent Component: Form for creating an auto-expiring short URL.
const FireLinksContent = ({ showToast, API_BASE_URL }) => {
    const [longUrl, setLongUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [generatedQrCodeDataUrl, setGeneratedQrCodeDataUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!longUrl) {
            showToast('Please enter a long URL.', 'error');
            return;
        }
        if (!expiresAt) {
            showToast('Please select an expiry date and time.', 'error');
            return;
        }

        const expiryDateObj = new Date(expiresAt);
        if (isNaN(expiryDateObj.getTime()) || expiryDateObj <= new Date()) {
            showToast('Invalid or past expiry date/time. Please select a future date.', 'error');
            return;
        }

        setLoading(true);
        setShortenedUrl('');
        setGeneratedQrCodeDataUrl('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/url/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullUrl: longUrl,
                    customAlias: customAlias.trim() === '' ? null : customAlias,
                    expiresAt: expiryDateObj.toISOString(),
                    type: 'fire', 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setShortenedUrl(data.shortUrl);
                setGeneratedQrCodeDataUrl(data.qrCodeDataUrl);
                showToast(data.message || 'Fire Link created successfully! You can now view it in My URLs.', 'success');
                setLongUrl('');
                setCustomAlias('');
                setExpiresAt('');
            } else {
                showToast(data.message || 'Failed to create Fire Link. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error creating Fire Link:', error);
            showToast('An unexpected error occurred while creating Fire Link. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Fire Link (Auto-expiring)</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="fireLongUrl" className="block text-sm font-medium text-gray-700 mb-2">Long URL</label>
                    <input
                        type="url"
                        id="fireLongUrl"
                        placeholder="e.g., https://temporary-offer.com"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="fireCustomAlias" className="block text-sm font-medium text-gray-700 mb-2">Custom Alias (Optional)</label>
                    <div className="flex rounded-xl shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            shrinkx.com/
                        </span>
                        <input
                            type="text"
                            id="fireCustomAlias"
                            placeholder="your-expiring-alias"
                            className="flex-1 block w-full p-3 border border-gray-300 rounded-r-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="fireExpiryTime" className="block text-sm font-medium text-gray-700 mb-2">Expiry Date & Time</label>
                    <input
                        type="datetime-local"
                        id="fireExpiryTime"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Fire Link'}
                </button>
                {shortenedUrl && (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-green-800 shadow-sm flex items-center justify-between flex-wrap">
                        <p className="font-medium mr-4">Shortened URL:</p>
                        <a href={`${shortenedUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline break-all">
                            {shortenedUrl}
                        </a>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${shortenedUrl}`);
                                showToast('Short URL copied!', 'success');
                            }}
                            className="ml-4 p-2 rounded-full hover:bg-green-100 transition-colors"
                            title="Copy Short URL"
                        >
                            <MdContentCopy className="text-xl" />
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

// LocationBasedLinkContent Component: Form for creating a geo-targeted short URL.
const LocationBasedLinkContent = ({ showToast, API_BASE_URL }) => {
    const [longUrl, setLongUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [geoRules, setGeoRules] = useState([{ countryCode: '', redirectUrl: '' }]);
    const [defaultGeoUrl, setDefaultGeoUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddRule = () => {
        setGeoRules([...geoRules, { countryCode: '', redirectUrl: '' }]);
    };

    const handleRemoveRule = (index) => {
        const newRules = geoRules.filter((_, i) => i !== index);
        setGeoRules(newRules);
    };

    const handleRuleChange = (index, field, value) => {
        const newRules = [...geoRules];
        newRules[index][field] = value;
        setGeoRules(newRules);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!longUrl) {
            showToast('Please enter a base URL.', 'error');
            return;
        }
        if (geoRules.some(rule => !rule.countryCode || !rule.redirectUrl)) {
            showToast('Please fill in all country code and redirect URL fields for geo-rules.', 'error');
            return;
        }

        setLoading(true);
        setShortenedUrl('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/url/location-shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullUrl: longUrl,
                    customAlias: customAlias.trim() === '' ? null : customAlias,
                    geoRules: geoRules,
                    defaultGeoUrl: defaultGeoUrl.trim() === '' ? null : defaultGeoUrl,
                    type: 'location', 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setShortenedUrl(data.shortUrl);
                showToast(data.message || 'Location-based URL created successfully!', 'success');
                setLongUrl('');
                setCustomAlias('');
                setGeoRules([{ countryCode: '', redirectUrl: '' }]);
                setDefaultGeoUrl('');
            } else {
                showToast(data.message || 'Failed to create location-based URL. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error creating location-based URL:', error);
            showToast('An unexpected error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Location Based Link</h2>
            <p className="text-gray-700 mb-6">Redirect users to different URLs based on their geographical location.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="geoLongUrl" className="block text-sm font-medium text-gray-700 mb-2">Base URL (Fallback if no geo-rule matches)</label>
                    <input
                        type="url"
                        id="geoLongUrl"
                        placeholder="e.g., https://your-main-site.com"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="geoCustomAlias" className="block text-sm font-medium text-gray-700 mb-2">Custom Alias (Optional)</label>
                    <div className="flex rounded-xl shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            shrinkx.com/
                        </span>
                        <input
                            type="text"
                            id="geoCustomAlias"
                            placeholder="your-geo-alias"
                            className="flex-1 block w-full p-3 border border-gray-300 rounded-r-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                        />
                    </div>
                </div>

                <div className="space-y-4 border p-4 rounded-xl bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-800">Geo-Redirection Rules</h3>
                    {geoRules.map((rule, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-end">
                            <div className="flex-1">
                                <label htmlFor={`countryCode-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Country Code (e.g., US, IN)</label>
                                <input
                                    type="text"
                                    id={`countryCode-${index}`}
                                    placeholder="e.g., US"
                                    className="w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                                    value={rule.countryCode}
                                    onChange={(e) => handleRuleChange(index, 'countryCode', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor={`redirectUrl-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Redirect URL</label>
                                <input
                                    type="url"
                                    id={`redirectUrl-${index}`}
                                    placeholder="e.g., https://country-specific-page.com"
                                    className="w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                                    value={rule.redirectUrl}
                                    onChange={(e) => handleRuleChange(index, 'redirectUrl', e.target.value)}
                                    required
                                />
                            </div>
                            {geoRules.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveRule(index)}
                                    className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                                    title="Remove Rule"
                                >
                                    <MdDelete className="text-xl" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddRule}
                        className="mt-2 px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add Another Rule
                    </button>
                </div>

                <div>
                    <label htmlFor="defaultGeoUrl" className="block text-sm font-medium text-gray-700 mb-2">Default Geo URL (Optional, overrides Base URL if no rule matches)</label>
                    <input
                        type="url"
                        id="defaultGeoUrl"
                        placeholder="e.g., https://your-global-fallback.com"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={defaultGeoUrl}
                        onChange={(e) => setDefaultGeoUrl(e.target.value)}
                    />
                    <p className="mt-2 text-sm text-gray-500">If no country rule matches, user will be redirected here. If empty, Base URL will be used as fallback.</p>
                </div>

                <div className="flex items-center pt-4">
                    <button
                        type="submit"
                        className="flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Location Based URL'}
                    </button>
                </div>

                {shortenedUrl && (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-green-800 shadow-sm flex items-center justify-between flex-wrap">
                        <p className="font-medium mr-4">Shortened URL:</p>
                        <a href={`${shortenedUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline break-all">
                            {shortenedUrl}
                        </a>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${shortenedUrl}`);
                                showToast('Short URL copied!', 'success');
                            }}
                            className="ml-4 p-2 rounded-full hover:bg-green-100 transition-colors"
                            title="Copy Short URL"
                        >
                            <MdContentCopy className="text-xl" />
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

// QrCodeGeneratorContent Component: Form for generating a QR code from text or URL.
const QrCodeGeneratorContent = ({ openQrModal, showToast }) => {
    const [inputText, setInputText] = useState('');

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!inputText) {
            showToast('Please enter text or a URL to generate a QR code.', 'error');
            return;
        }
        openQrModal(inputText);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">QR Code Generator</h2>
            <p className="text-gray-700 mb-6">Enter any URL or text to instantly generate a downloadable QR code.</p>
            <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                    <label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 mb-2">
                        URL or Text
                    </label>
                    <input
                        id="qr-input"
                        type="text"
                        placeholder="e.g., https://example.com or 'Hello World'"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center pt-4">
                    <button
                        type="submit"
                        className="flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <MdQrCode2 className="mr-2 text-lg" />
                        Generate & Preview QR Code
                    </button>
                </div>
            </form>
        </div>
    );
};

const AnalyticsSectionContent = ({ API_BASE_URL }) => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/url/analytics/summary`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch analytics data.');
                }

                const data = await response.json();
                setAnalyticsData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [API_BASE_URL]);

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 text-center">
                Loading Analytics...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 text-center text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">URL Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="p-5 bg-blue-50 rounded-xl border border-blue-200 text-blue-800 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-lg font-medium mb-2">Total Clicks</h3>
                    <p className="text-4xl font-bold">{analyticsData?.totalClicks.toLocaleString() || 0}</p>
                </div>
                <div className="p-5 bg-green-50 rounded-xl border border-green-200 text-green-800 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-lg font-medium mb-2">Total Links</h3>
                    <p className="text-4xl font-bold">{analyticsData?.totalLinks || 0}</p>
                </div>
                <div className="p-5 bg-purple-50 rounded-xl border border-purple-200 text-purple-800 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-lg font-medium mb-2">Active Links</h3>
                    <p className="text-4xl font-bold">{analyticsData?.activeLinks || 0}</p>
                </div>
                <div className="p-5 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-lg font-medium mb-2">Average Clicks/Link</h3>
                    <p className="text-4xl font-bold">{analyticsData?.averageClicksPerLink || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Clicks Over Time</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData?.clicksOverTime}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
                                <YAxis tick={{ fill: '#4B5563' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} />
                                <Legend />
                                <Bar dataKey="clicks" fill="#3B82F6" name="Total Clicks" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4"><MdLanguage className="mr-2 text-purple-600 inline-block" /> Top Countries</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={analyticsData?.topCountries} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tick={{ fill: '#4B5563' }} />
                                <YAxis type="category" dataKey="name" tick={{ fill: '#4B5563' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} />
                                <Legend />
                                <Bar dataKey="clicks" fill="#8884d8" name="Clicks" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsContent = ({ user, setUser, showToast, API_BASE_URL }) => {
    const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
    const [apiKey, setApiKey] = useState('Click below to generate your key.');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(profileData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            showToast('Profile updated successfully!', 'success');
            setUser(data.user);
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(passwordData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            showToast('Password changed successfully!', 'success');
            setPasswordData({ oldPassword: '', newPassword: '' });
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const handleGenerateApiKey = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/api-key`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setApiKey(data.apiKey);
            showToast('API Key generated!', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/delete-account`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            showToast('Account deleted successfully. Logging you out.', 'info');
            localStorage.removeItem('user');
            window.location.href = '/login';
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    return (
        <div className="space-y-8">
            {/* Profile Settings */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center"><FaUserEdit className="mr-3 text-blue-500" /> Profile Settings</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="mt-1 w-full p-2 border border-gray-300 rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="mt-1 w-full p-2 border border-gray-300 rounded-xl" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Save Changes</button>
                </form>
            </div>

            {/* Security Settings */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center"><FaKey className="mr-3 text-yellow-500" /> Security</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Old Password</label>
                        <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="mt-1 w-full p-2 border border-gray-300 rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 w-full p-2 border border-gray-300 rounded-xl" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Change Password</button>
                </form>
            </div>

            {/* API Settings */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center"><MdQrCode2 className="mr-3 text-gray-500" /> API Key</h2>
                <p className="text-gray-600 mb-2">Your API key for integrations:</p>
                <div className="p-3 bg-gray-100 rounded-xl font-mono text-sm text-gray-700 break-all">{apiKey}</div>
                <button onClick={handleGenerateApiKey} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700">Generate New Key</button>
            </div>

            {/* Delete Account */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-red-200">
                <h2 className="text-2xl font-semibold mb-4 text-red-600 flex items-center"><FaTrash className="mr-3" /> Danger Zone</h2>
                <p className="text-gray-700">Deleting your account is permanent and cannot be undone.</p>
                {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">Delete My Account</button>
                ) : (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="font-semibold text-red-800">Are you absolutely sure?</p>
                        <div className="flex space-x-4 mt-2">
                            <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">Yes, Delete It</button>
                            <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sidebar Component: Navigation menu for the dashboard.
const Sidebar = ({ currentPage, setCurrentPage, isMobileSidebarOpen, toggleMobileSidebar, handleLogout }) => (
    <>
        {isMobileSidebarOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden" onClick={toggleMobileSidebar}></div>
        )}

        <div className={`fixed inset-y-0 left-0 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full bg-white shadow-md w-64 p-4 border-r border-gray-200 z-50`}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                    <img src="https://placehold.co/32x32/FFC0CB/000000?text=SX" alt="ShrinkX Logo" className="h-8 w-8 rounded-full object-contain" />
                    <span className="text-2xl font-bold text-gray-800">ShrinkX</span>
                </div>
                <button onClick={toggleMobileSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-md">
                    <MdClose className="text-2xl" />
                </button>
            </div>
            <nav className="space-y-2 flex-grow overflow-y-auto">
                <button onClick={() => { setCurrentPage('Dashboard'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'Dashboard' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdDashboard className="mr-3 text-xl" />Dashboard</button>
                <button onClick={() => { setCurrentPage('MyURLs'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'MyURLs' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdOutlineLink className="mr-3 text-xl" />My URLs</button>
                {/* All original sidebar items are restored */}
                <button onClick={() => { setCurrentPage('CreateShortLink'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'CreateShortLink' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdAddLink className="mr-3 text-xl" />Create Short Link</button>
                <button onClick={() => { setCurrentPage('CustomAlias'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'CustomAlias' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdCreate className="mr-3 text-xl" />Custom Alias</button>
                <button onClick={() => { setCurrentPage('ProtectedLinks'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'ProtectedLinks' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdLock className="mr-3 text-xl" />Protected Links</button>
                <button onClick={() => { setCurrentPage('FireLinks'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'FireLinks' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdLocalFireDepartment className="mr-3 text-xl" />Fire Links</button>
                <button onClick={() => { setCurrentPage('LocationBasedLink'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'LocationBasedLink' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdLanguage className="mr-3 text-xl" />Location Based Link</button>
                <button onClick={() => { setCurrentPage('QrCodeGenerator'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'QrCodeGenerator' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdQrCode2 className="mr-3 text-xl" />QR Code Generator</button>
                <button onClick={() => { setCurrentPage('Analytics'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'Analytics' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdAnalytics className="mr-3 text-xl" />Analytics</button>
                <button onClick={() => { setCurrentPage('Settings'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'Settings' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdSettings className="mr-3 text-xl" />Settings</button>
            </nav>
            <div className="mt-auto pt-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 text-red-600 hover:bg-red-50"
                >
                    <MdLogout className="mr-3 text-xl" />
                    Logout
                </button>
            </div>
        </div>
    </>
);

// TopNavbar Component: Displays current page title and user info.
const TopNavbar = ({ currentPageTitle, toggleMobileSidebar, user, handleLogout }) => (
    <div className="flex items-center justify-between bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center">
            <button
                onClick={toggleMobileSidebar}
                className="lg:hidden mr-4 text-gray-600 hover:text-gray-900 p-1 rounded-md"
            >
                <MdMenu className="text-2xl" />
            </button>
            <div className="text-xl font-semibold text-gray-800">
                {currentPageTitle}
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative">
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    {user?.gravatar ? (
                        <img
                            src={user.gravatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <FaUserCircle className="text-3xl text-gray-600" />
                    )}
                    <span className="text-gray-700 hidden md:block">{user?.name}</span>
                </button>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200">
                <MdLogout className="text-xl" />
                <span className="hidden md:block">Logout</span>
            </button>
        </div>
    </div>
);

// QrCodeModal Component: Displays a QR code for a given URL or text.
const QrCodeModal = ({ qrCodeDataUrl, onClose }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (qrCodeDataUrl) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [qrCodeDataUrl]);

    const handleDownload = () => {
        if (qrCodeDataUrl) {
            const link = document.createElement('a');
            link.href = qrCodeDataUrl;
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-sm relative">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">QR Code Preview</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
                        <MdClose className="text-2xl" />
                    </button>
                </div>
                <div className="p-6 flex flex-col items-center">
                    {loading ? (
                        <div className="w-64 h-64 flex items-center justify-center border border-gray-300 rounded-xl mb-6 bg-gray-50 text-gray-500">
                            Generating QR Code...
                        </div>
                    ) : (
                        <img src={qrCodeDataUrl} alt="QR Code" className="w-64 h-64 border border-gray-300 rounded-xl mb-6" />
                    )}

                    <button
                        onClick={handleDownload}
                        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading || !qrCodeDataUrl}
                    >
                        <MdCloudDownload className="mr-2 text-xl" />
                        Download QR Code
                    </button>
                </div>
            </div>
        </div>
    );
};

// ProtectedLinkPasswordModal Component: Prompts for password for protected links.
const ProtectedLinkPasswordModal = ({ shortCode, onClose, showToast, API_BASE_URL }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        if (!password) {
            showToast('Please enter the password.', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/url/check-protected-link/${shortCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ password }),
                redirect: 'manual', 
            });

            if (response.status >= 300 && response.status < 400) {
                const redirectedUrl = response.headers.get('Location');
                if (redirectedUrl) {
                    onClose();
                    showToast('Password correct! Redirecting...', 'success');
                    window.open(redirectedUrl, '_blank');
                } else {
                    showToast('Error: Redirect URL not found in response.', 'error');
                }
            } else {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    if (response.ok) {
                        if (data.success && data.fullUrl) {
                            onClose();
                            showToast('Password correct! Redirecting...', 'success');
                            window.open(data.fullUrl, '_blank');
                        } else {
                            showToast(data.message || 'Incorrect password. Please try again.', 'error');
                        }
                    } else {
                        showToast(data.message || 'Incorrect password. Please try again.', 'error');
                    }
                } else {
                    const text = await response.text();
                    console.error('Backend responded with non-JSON error:', text);
                    showToast('An unexpected server response occurred.', 'error');
                }
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            showToast('An error occurred while verifying password.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-sm relative">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">Enter Password</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
                        <MdClose className="text-2xl" />
                    </button>
                </div>
                <form onSubmit={handleSubmitPassword} className="p-6 space-y-4">
                    <p className="text-gray-700">This link is protected. Please enter the password to proceed:</p>
                    <div>
                        <label htmlFor="modalPassword" className="sr-only">Password</label>
                        <input
                            type="password"
                            id="modalPassword"
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Unlock Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};


// DashboardUI Main Component: The main application layout and state management.
const DashboardUI = () => {
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [user, setUser] = useState(null);

    const [isProtectedLinkModalOpen, setIsProtectedLinkModalOpen] = useState(false);
    const [protectedShortCode, setProtectedShortCode] = useState(null);

    const API_BASE_URL = 'http://localhost:3000';

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser.user);
            } catch (err) {
                console.error("Error parsing user from localStorage:", err);
            }
        }
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                showToast('Logged out successfully!', 'success');
                localStorage.removeItem('user'); 
                setUser(null); 
                setTimeout(() => {
                    window.location.href = '/login'; 
                }, 1500);
            } else {
                throw new Error(data.message || 'Logout failed.');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    };
    const openQrModal = async (urlOrData) => {
        if (!urlOrData) {
            showToast('No URL provided for QR code generation.', 'error');
            return;
        }

        setIsQrModalOpen(true);
        setQrCodeDataUrl(''); 
        if (urlOrData.startsWith('data:image')) {
            setQrCodeDataUrl(urlOrData);
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/url/generate-qr-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ url: urlOrData }),
            });

            const data = await response.json();

            if (response.ok) {
                setQrCodeDataUrl(data.qrCodeDataUrl);
            } else {
                showToast(data.message || 'Failed to generate QR code.', 'error');
                closeQrModal();
            }
        } catch (error) {
            console.error('Error fetching QR code:', error);
            showToast('An unexpected error occurred while generating QR code.', 'error');
            closeQrModal();
        }
    };

    const closeQrModal = () => {
        setIsQrModalOpen(false);
        setQrCodeDataUrl('');
    };

    const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

    const showToast = (message, type) => {
        setToast({ message, type });
    };
    const closeToast = () => {
        setToast(null);
    };
    const openProtectedLinkModal = (shortCode) => {
        setProtectedShortCode(shortCode);
        setIsProtectedLinkModalOpen(true);
    };
    const closeProtectedLinkModal = () => {
        setProtectedShortCode(null);
        setIsProtectedLinkModalOpen(false);
    };

    // Determine the title for the current page
    const getPageTitle = (page) => {
        switch (page) {
            case 'Dashboard': return 'Dashboard Overview';
            case 'MyURLs': return 'My Shortened URLs';
            case 'CreateShortLink': return 'Create Short Link';
            case 'CustomAlias': return 'Custom Aliases';
            case 'ProtectedLinks': return 'Protected Links';
            case 'FireLinks': return 'Fire Links';
            case 'LocationBasedLink': return 'Location Based Links';
            case 'QrCodeGenerator': return 'QR Code Generator';
            case 'Analytics': return 'Advanced Analytics';
            case 'Settings': return 'Account Settings';
            default: return 'Dashboard';
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar Navigation */}
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isMobileSidebarOpen={isMobileSidebarOpen}
                toggleMobileSidebar={toggleMobileSidebar}
                handleLogout={handleLogout}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation Bar */}
                <TopNavbar
                    currentPageTitle={getPageTitle(currentPage)}
                    toggleMobileSidebar={toggleMobileSidebar}
                    user={user}
                    handleLogout={handleLogout}
                />

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
                    {currentPage === 'Dashboard' && <DashboardOverviewContent user={user} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'MyURLs' && <MyUrlsContent openQrModal={openQrModal} showToast={showToast} API_BASE_URL={API_BASE_URL} openProtectedLinkModal={openProtectedLinkModal} setCurrentPage={setCurrentPage} />}
                    {currentPage === 'CreateShortLink' && <CreateShortLinkContent openQrModal={openQrModal} showToast={showToast} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'CustomAlias' && <CustomAliasContent showToast={showToast} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'ProtectedLinks' && <ProtectedLinksContent openQrModal={openQrModal} showToast={showToast} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'FireLinks' && <FireLinksContent showToast={showToast} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'LocationBasedLink' && <LocationBasedLinkContent showToast={showToast} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'QrCodeGenerator' && <QrCodeGeneratorContent openQrModal={openQrModal} showToast={showToast} />}
                    {currentPage === 'Analytics' && <AnalyticsSectionContent API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'Settings' && <SettingsContent user={user} setUser={setUser} showToast={showToast} API_BASE_URL={API_BASE_URL} />}
                </main>
            </div>

            {/* Modals */}
            {isQrModalOpen && <QrCodeModal qrCodeDataUrl={qrCodeDataUrl} onClose={closeQrModal} />}
            {isProtectedLinkModalOpen && (
                <ProtectedLinkPasswordModal
                    shortCode={protectedShortCode}
                    onClose={closeProtectedLinkModal}
                    showToast={showToast}
                    API_BASE_URL={API_BASE_URL}
                />
            )}
            {/* Toast Notification */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
        </div>
    );
};

export default DashboardUI;
