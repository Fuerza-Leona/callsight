import useLogout from '../hooks/useLogout';

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <button
      onClick={logout}
      id="logout"
      className="text-sm bg-white text-black rounded-lg cursor-pointer font-semibold p-3 shadow hover:bg-gray-300"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
