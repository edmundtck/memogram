export const nameInitial = (displayName) => {
	if (displayName.length === 0) return;
	const initials = displayName.split(' ').map((word) => word[0].toUpperCase()).join('');
	return initials;
};
