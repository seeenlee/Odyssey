import React, {useState} from "react"
import api from "./apis"
import { Link, useNavigate, useLocation } from "react-router-dom";
export const FriendProfile = (props) => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    async function sendFriendRequest() {
        const email = sessionStorage.getItem("user");
        if (state.email.length === 0) {
          alert("Please enter a value!");
          return;
        }
        if (!email) {
          alert("You must be logged in to send a friend request!");
          return;
        }
        const payload = {email: email, friend: state.email};
        await api.sendFriendRequest(payload)
        .then(res => {
            alert("Friend request sent successfully");
        })
        .catch (err => {
          if (err.response) {
            alert(err.response.data);
          }
          return;
        });
      }

    return (
        <div className="auth-form-container">
            <h2>User's Profile</h2>
            <form  >
                <h4 className="friendProfile">Friend's Name: </h4><p>{state.name}</p>
                <h4 className="friendProfile">Friend's Email: </h4> <p>{state.email}</p>
                <h4 className="friendProfile">Friend's Status: </h4> <p>{state.status}</p>
                <h4 className="friendProfile">Friend's Privacy: </h4> <p>{state.privacy}</p>


            </form>
            <button onClick={sendFriendRequest}>Send Friend Request</button> 
            {/* <button type="submit" onClick={() => props.onFormSwitch('calender')}>Weekly View</button>
            <button className="reg-btn" onClick={() => props.onFormSwitch('register')}>Create an account</button>
            <button className="reset-btn" onClick={() => props.onFormSwitch('reset')}>Reset Password</button> */}
            {/* not sure why the buttons are small */}
            <Link to="/friends">
                <button size="45" className="reg-btn">Friends</button>
            </Link>
            <Link to="/cal">
                <button size="45" className="reset-btn" type="submit">Weekly View</button>
            </Link>
            
           

        </div>
    )
}