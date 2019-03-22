declare module 'react-router-dom';
declare module 'reactstrap';
declare module 'react-notifications-component';

interface Window {
	showNotification(title: string, message: string, type: string)
}