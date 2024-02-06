import axios from "axios";

const instance = axios.create({
	baseURL: "https://my-domain.com:3001",
	timeout: 5000,
});

export default instance;