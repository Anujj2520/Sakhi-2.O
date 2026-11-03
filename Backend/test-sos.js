async function testSOS() {
  try {
    const response = await fetch("http://localhost:5000/api/alerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        deviceId: "Sakhi-001",
        type: "SOS",
        message: "Test SOS Alert from Sakhi 2.0",
        latitude: 19.076,
        longitude: 72.8777
      })
    });

    const data = await response.json();
    console.log("SOS Response:", data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testSOS();