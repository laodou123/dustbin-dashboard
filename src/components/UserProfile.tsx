// UserProfile.tsx
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Alert,
  Modal,
  Form,
  Image,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";

const UserProfile: React.FC = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [newDisplayName, setNewDisplayName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Redirect to login if no user is logged in
    if (!user) {
      navigate("/");
    } else {
      setNewDisplayName(user.displayName || "");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        await signOut(auth);
        alert("Logged out successfully");
        navigate("/"); // Redirect to login page
      } catch (err: any) {
        console.error("Logout Error:", err);
        setError("Failed to log out. Please try again.");
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newDisplayName.trim() === "") {
      setError("Display name cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(user, { displayName: newDisplayName });
      setSuccess("Display name updated successfully.");
      setShowModal(false);
    } catch (err: any) {
      console.error("Update Profile Error:", err);
      setError(err.message || "Failed to update display name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="mx-auto shadow-sm" style={{ maxWidth: "800px" }}>
        <Card.Body>
          <Row className="align-items-center">
            {/* Profile Image */}
            <Col xs={12} md={4} className="text-center mb-4 mb-md-0">
              {/* Hard-Coded Profile Picture */}
              <Image
                src="https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                roundedCircle
                width={200}
                height={200}
                alt="Profile"
                fluid
              />
            </Col>

            {/* User Information */}
            <Col xs={12} md={8}>
              <h2>{user?.displayName || "No Display Name"}</h2>
              <p className="text-muted mb-1">{user?.email}</p>
              <p className="text-muted mb-3">UID: {user?.uid}</p>

              {/* Additional Information */}
              <Row className="mb-3">
                <Col xs={6}>
                  <strong>Account Created:</strong>
                </Col>
                <Col xs={6}>{user?.metadata.creationTime || "N/A"}</Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}>
                  <strong>Last Sign-In:</strong>
                </Col>
                <Col xs={6}>{user?.metadata.lastSignInTime || "N/A"}</Col>
              </Row>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  onClick={() => setShowModal(true)}
                  className="flex-grow-1"
                >
                  Update Display Name
                </Button>
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  className="flex-grow-1"
                >
                  Logout
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Update Display Name Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Display Name</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateProfile}>
          <Modal.Body>
            <Form.Group controlId="formDisplayName">
              <Form.Label>New Display Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new display name"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default UserProfile;
