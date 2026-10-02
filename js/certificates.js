window.certificateCatalog = Array.from({ length: 19 }, (_, index) => {
	const number = String(index + 4).padStart(2, '0');

	return {
		title: `Сертификат ${number}`,
		image: `assets/certificates/certificate-${number}.jpg`,
		organization: '',
		description: ''
	};
});
