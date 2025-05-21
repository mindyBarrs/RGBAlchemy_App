import React, { useCallback, useEffect, useRef, useState } from "react";

import type { ModalProps } from "../../lib/types/component.types";

import "./Modal.css";

const Modal: React.FC<ModalProps> = ({ isOpen, win, onClose, onReload }) => {
	const targetRef = useRef<HTMLDivElement | null>(null);

	const handleOutsideClick = useCallback(
		(e: MouseEvent) => {
			if (targetRef.current && !targetRef.current.contains(e.target as Node)) {
				onClose();
			}
		},
		[onClose]
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("mousedown", handleOutsideClick);
		} else {
			document.removeEventListener("mousedown", handleOutsideClick);
		}

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="modal-mask">
			<div className="modal-wrapper">
				<div className="modal-container" ref={targetRef}>
					<div className="modal-header">
						{win ? <h2>Congratulations!</h2> : <h2>Game Over</h2>}
						<button onClick={onClose}>X</button>
					</div>

					<div className="modal-body">
						{!win ? (
							<p>Would you like to play again?</p>
						) : (
							<p>You have completed the game!</p>
						)}

						<button onClick={onReload}>Play Again</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
