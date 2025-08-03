import PropTypes from 'prop-types';

/**
 * A customizable loading spinner component
 * @param {Object} props - Component props
 * @param {boolean} [props.fullScreen=false] - Whether to display the loader as full screen overlay
 * @param {('sm'|'md'|'lg'|'xl')} [props.size='md'] - Size of the loader
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} The Loader component
 */
const Loader = ({ fullScreen = false, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // Validate size prop
  const validatedSize = sizeClasses[size] ? size : 'md';

  const loader = (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-indigo-500 ${sizeClasses[validatedSize]}`}
        aria-busy="true"
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

Loader.defaultProps = {
  fullScreen: false,
  size: 'md',
  className: '',
};

export default Loader;
