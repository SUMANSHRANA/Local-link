import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <h3>Local Link</h3>
      <p>Your trusted home services platform</p>
      <p style={{ marginTop: 12, fontSize: 13 }}>
        Are you a professional? <Link to="/agent/register" style={{ color: "#a39bff" }}>Join as a Service Provider</Link>
      </p>
      <p style={{ marginTop: 16, fontSize: 13 }}>© {new Date().getFullYear()} Local Link. All rights reserved.</p>
    </footer>
  );
}
