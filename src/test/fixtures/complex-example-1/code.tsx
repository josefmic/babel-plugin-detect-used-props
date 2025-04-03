import React, { useState, useCallback } from "react";
const UserInfo = ({ name, age }: { name: string; age: number }) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>Age: {age}</p>
    </div>
  );
};
const UserDetails = ({
  user,
  showInfo,
}: {
  user: {
    name: string;
    age: number;
  };
  showInfo: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(showInfo);
  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);
  return (
    <div>
      {isVisible ? <UserInfo name={user.name} age={user.age} /> : null}
      <button onClick={toggleVisibility}>
        {isVisible ? "Hide Details" : "Show Details"}
      </button>
    </div>
  );
};
const Address = ({
  street,
  city,
  zip,
}: {
  street: string;
  city: string;
  zip: string;
}) => {
  return (
    <div>
      <h4>Address</h4>
      <p>{street}</p>
      <p>{city}</p>
      <p>{zip}</p>
    </div>
  );
};
const ComplexComponent = () => {
  const user = {
    name: "John Doe",
    age: 30,
  };
  const address = {
    street: "123 Main St",
    city: "Somewhere",
    zip: "12345",
  };
  return (
    <div>
      <h2>User Profile</h2>
      <UserDetails user={user} showInfo={true} />
      <Address street={address.street} city={address.city} zip={address.zip} />
    </div>
  );
};
export default ComplexComponent;
