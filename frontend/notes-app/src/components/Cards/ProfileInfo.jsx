import PropTypes from "prop-types";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  const fullName = userInfo?.fullName || "";
  const initials = getInitials(fullName);

  if (!userInfo) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {initials}
      </div>

      <div>
        <p className="text-sm font-medium">{fullName}</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

ProfileInfo.propTypes = {
  userInfo: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
  }),
  onLogout: PropTypes.func.isRequired,
};

export default ProfileInfo;
