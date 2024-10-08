const UserCard = ({ users, onDeleteClick }: any) => {
  return (
    <div className="grid grid-cols-1 theme_text md:grid-cols-2 lg:grid-cols-5 gap-4">
      {users.map((user: any) => (
        <div
          key={user._id}
          className="theme_container gap-1 flex flex-col justify-center items-center p-4 rounded-md shadow-md "
        >
          <img
            src={
              user.image ||
              "https://firebasestorage.googleapis.com/v0/b/chat-app-ed074.appspot.com/o/Flipcart%20clone%2Fprofile-pic-male_4811a1.svg?alt=media&token=e17b4c7a-73de-401f-a54d-da1ab00f1e13"
            }
            alt="User"
            className="size-12 rounded-md"
          />
          <h3 className="font-bold mt-2">{user.name}</h3>
          <div className="flex flex-col justify-center items-center h-10">
            {" "}
            <p>{user.email}</p>
            <p>{user.mobile}</p>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4 ">
            <button
              title="Delete"
              onClick={() => onDeleteClick(user._id)}
              className="text-red-600 "
            >
              <i className="fas fa-trash-alt mr-1"></i> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCard;
