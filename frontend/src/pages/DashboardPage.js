import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import portfolioService from '../services/portfolioService';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, published: 0, views: 0, drafts: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await portfolioService.getPortfolios();
      setPortfolios(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const published = response.data.filter(p => p.published).length;
      const views = response.data.reduce((sum, p) => sum + (p.views || 0), 0);
      const drafts = total - published;
      setStats({ total, published, views, drafts });
    } catch (err) {
      setError('Failed to load portfolios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (portfolio) => {
    setPortfolioToDelete(portfolio);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!portfolioToDelete) return;

    try {
      await portfolioService.deletePortfolio(portfolioToDelete._id);
      setPortfolios(portfolios.filter(p => p._id !== portfolioToDelete._id));
      setShowDeleteModal(false);
      setPortfolioToDelete(null);
      
      // Update stats
      const newPortfolios = portfolios.filter(p => p._id !== portfolioToDelete._id);
      const total = newPortfolios.length;
      const published = newPortfolios.filter(p => p.published).length;
      const views = newPortfolios.reduce((sum, p) => sum + (p.views || 0), 0);
      const drafts = total - published;
      setStats({ total, published, views, drafts });
    } catch (err) {
      alert('Failed to delete portfolio');
      console.error(err);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const response = await portfolioService.togglePublish(id);
      setPortfolios(portfolios.map(p => 
        p._id === id ? { ...p, published: response.data.published } : p
      ));
    } catch (err) {
      alert('Failed to update publish status');
      console.error(err);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const response = await portfolioService.duplicatePortfolio(id);
      setPortfolios([response.data, ...portfolios]);
      // Update stats
      setStats(prev => ({ ...prev, total: prev.total + 1, drafts: prev.drafts + 1 }));
    } catch (err) {
      alert('Failed to duplicate portfolio');
      console.error(err);
    }
  };

  const copyPublicLink = (slug) => {
    const link = `${window.location.origin}/portfolio/${slug}`;
    navigator.clipboard.writeText(link);
    alert('Public link copied to clipboard!');
  };

  if (loading) {
    return <Loading message="Loading your portfolios..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 text-lg">Manage your AI-powered portfolios</p>
            </div>
            <Link 
              to="/create" 
              className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New Portfolio
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 fade-in">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Portfolios</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Published</p>
                <p className="text-3xl font-bold">{stats.published}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Total Views</p>
                <p className="text-3xl font-bold">{stats.views}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Drafts</p>
                <p className="text-3xl font-bold">{stats.drafts}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-md fade-in">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Portfolio Grid or Empty State */}
        {portfolios.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl fade-in">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No portfolios yet</h3>
              <p className="text-gray-600 mb-8 text-lg">Get started by creating your first AI-powered portfolio in minutes!</p>
              <Link to="/create" className="btn-primary inline-flex items-center gap-2 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Portfolio
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {portfolios.map((portfolio) => (
              <div key={portfolio._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
                {/* Portfolio Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 relative">
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      portfolio.published 
                        ? 'bg-green-400 text-green-900' 
                        : 'bg-gray-200 text-gray-700'
                    } shadow-md`}>
                      {portfolio.published ? '✓ Published' : '📝 Draft'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 pr-20 line-clamp-1">
                    {portfolio.personalInfo?.fullName || 'Untitled Portfolio'}
                  </h3>
                  <p className="text-blue-100 text-sm line-clamp-2">
                    {portfolio.personalInfo?.tagline || 'No tagline yet'}
                  </p>
                </div>

                {/* Portfolio Content */}
                <div className="p-6">
                  {/* Skills */}
                  {portfolio.skills && portfolio.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {portfolio.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                            {skill.name}
                          </span>
                        ))}
                        {portfolio.skills.length > 4 && (
                          <span className="text-gray-500 text-xs font-medium px-2 py-1">
                            +{portfolio.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{portfolio.projects?.length || 0}</p>
                      <p className="text-xs text-gray-600">Projects</p>
                    </div>
                    <div className="text-center border-l border-r border-gray-100">
                      <p className="text-2xl font-bold text-gray-800">{portfolio.views || 0}</p>
                      <p className="text-xs text-gray-600">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{portfolio.experience?.length || 0}</p>
                      <p className="text-xs text-gray-600">Experience</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    Updated {new Date(portfolio.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      to={`/edit/${portfolio._id}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <Link 
                      to={`/view/${portfolio._id}`}
                      className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Link>
                  </div>

                  {/* Secondary Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleTogglePublish(portfolio._id)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold flex items-center justify-center gap-1"
                      title={portfolio.published ? 'Unpublish' : 'Publish'}
                    >
                      {portfolio.published ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          Unpublish
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Publish
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDuplicate(portfolio._id)}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold"
                      title="Duplicate"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => confirmDelete(portfolio)}
                      className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Public Link */}
                  {portfolio.published && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => copyPublicLink(portfolio.slug)}
                        className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-2 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy Public Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 fade-in">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Portfolio?</h3>
                <p className="text-gray-600 mb-2 font-medium">
                  {portfolioToDelete?.personalInfo?.fullName || 'This portfolio'}
                </p>
                <p className="text-gray-500 mb-6">
                  This action cannot be undone. All portfolio data will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setPortfolioToDelete(null);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
