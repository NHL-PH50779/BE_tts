const successHandler = (req, res, next) => {
	res.success = (data, message = "Thành công") => {
		res.status(200).json({
			success: true,
			statusCode: 200,
			message,
			data,
		});
	};
	next();
};

export default successHandler;
