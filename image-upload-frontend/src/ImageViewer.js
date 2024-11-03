import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Transition component for sliding effect
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Reusable dialog component
function ImageViewer({ open, onClose, children, imageUrl }) {
    return (
        <Dialog
            onClose={onClose}
            open={open}
            TransitionComponent={Transition}
            aria-labelledby="dialog-title"
        >
            <div style={{ display: 'flex', justifyContent: 'end' }}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            </div>

            <img
                src={imageUrl}
                alt="Enlarged view"
                style={{
                    maxWidth: '100%',   // Limit width to 90% of dialog
                    maxHeight: '60vh', // Limit height to 80% of the viewport height
                    objectFit: 'contain' // Ensure the image fits within the container
                }}
            />
            {children} {/* for necessary buttons */}
        </Dialog>
    );
}

ImageViewer.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
};

export default ImageViewer;
