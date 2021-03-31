import React, { useState, useContext, useRef } from 'react';

import { Dialog, TextField } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ErrorIcon from '@material-ui/icons/Error';
import UploadButton from '../button/UploadButton';
import Button from '../button/Button';

import { UserContext } from '../../contexts/userContext';
import { storage, firestore, timestamp } from '../../firebase/config';
import styles from './AddPostModal.module.scss';

const initialState = {
	caption: '',
	file: null
};

const AddPostModal = ({ isOpen, handleAddPostClose }) => {
	const [ currentUser ] = useContext(UserContext);
	const [ form, setForm ] = useState(initialState);
	const [ progress, setProgress ] = useState(0);
	const [ error, setError ] = useState('');
	const imageRef = useRef();

	// Changing of caption and file value
	const handleChange = (e) => {
		let { value, name } = e.target;
		if (name === 'file') {
			// Reset error
			setError('');
			value = e.target.files[0];
			// Check file size, more than 2mb will empty the value for input and display
			if (value.size > 2097152) {
				imageRef.current.value = null;
				value = null;
				setError('File size is too large. Please upload image that is less than 2mb.');
			}
		}

		setForm({
			...form,
			[name]: value
		});
	};
	// 3. Creating post will happen after getting the downloadURL
	const createPost = async (downloadURL) => {
		try {
			const docRef = await firestore.collection('posts').add({
				imageURL: downloadURL,
				user: {
					displayName: currentUser.displayName,
					uid: currentUser.uid
				},
				likes: [],
				caption: form.caption,
				createdAt: timestamp
			});
			// to get the id of the document => docRef.id
			console.log('Document created successfull', docRef.id);
		} catch (error) {
			console.error('Error adding document: ', error);
			throw new Error(error);
		}
	};

	const uploadFile = () => {
		const storageRef = storage.ref();
		const uploadTask = storageRef.child(form.file.name).put(form.file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
				setProgress(progress);
			},
			(error) => {
				setError(error.message);
			},
			async () => {
				// 2. When uploaded file success to storage, will create post
				try {
					const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
					await createPost(downloadURL);
					// Reset back to initial state then close modal
					setForm(initialState);
					setProgress(0);
					handleAddPostClose();
					window.scrollTo(0, 0);
				} catch (error) {
					setError(error.message);
				}
			}
		);
	};
	// 1. Upload file will happen after click on submit
	const handleSubmit = (e) => {
		e.preventDefault();
		if (progress === 0) uploadFile();
	};

	const handleClose = () => {
		// To prevent closing of modal when uploading is happening
		if (progress === 0) {
			setForm(initialState);
			handleAddPostClose();
		}
	};

	return (
		<Dialog open={isOpen} onClose={handleClose}>
			<div className={styles.root}>
				{progress > 0 && (
					<div className={styles.progressWrapper}>
						<div className={styles.progress} style={{ width: `${progress}%` }} />
						<p className={styles.percentage}>{`${Math.trunc(progress)}%`}</p>
					</div>
				)}
				<h2 className={styles.heading}>Create a post</h2>
				<form onSubmit={handleSubmit} className={styles.form}>
					<input
						accept="image/jpeg,image/png"
						className={styles.fileInput}
						name="file"
						id="contained-button-file"
						type="file"
						required
						ref={imageRef}
						onChange={handleChange}
						disabled={progress > 0}
					/>
					<div className={styles.group}>
						<label htmlFor="contained-button-file">
							<UploadButton secondary disabled={progress > 0}>
								<CloudUploadIcon fontSize="large" /> Upload
							</UploadButton>
						</label>
						<p className={styles.filename}>{form.file && form.file.name}</p>
					</div>

					<TextField
						fullWidth
						label="Write a caption"
						multiline
						rowsMax={4}
						InputLabelProps={{ style: { fontSize: '1.6rem' } }}
						InputProps={{ style: { fontSize: '1.6rem' } }}
						required
						name="caption"
						value={form.caption}
						onChange={handleChange}
						disabled={progress > 0}
					/>
					{error && (
						<div className={styles.error}>
							<ErrorIcon fontSize="large" />
							<span>{error}</span>
						</div>
					)}
					<div>
						<Button type="submit" disabled={progress > 0}>
							Create
						</Button>
					</div>
				</form>
			</div>
		</Dialog>
	);
};

export default AddPostModal;
