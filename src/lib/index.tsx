interface UserLocation {
    latitude: number;
    longitude: number;
}
export const getUserLocation = () => {
    return new Promise<UserLocation>((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    reject(error);
                }
            );
        } else {
            const error = new Error(
                'Geolocation is not supported by this browser.'
            );
            console.error(error.message);
            reject(error);
        }
    });
};
