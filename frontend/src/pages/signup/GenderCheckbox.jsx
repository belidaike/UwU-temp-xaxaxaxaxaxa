import React from 'react'

const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
	return (
		<div className='flex'>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer ${selectedGender === 'male' ? 'selected' : ''}`}>
					<span className='label-text text-base-300'>Male</span>
					<input checked={selectedGender === 'male'} onChange={() => onCheckboxChange('male')} type='checkbox' className='checkbox checkbox-success border-slate-400' />
				</label>
			</div>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer ${selectedGender === 'female' ? 'selected' : ''}`}>
					<span className='label-text text-base-300'>Female</span>
					<input checked={selectedGender === 'female'} onChange={() => onCheckboxChange('female')} type="checkbox" className="checkbox checkbox-success border-slate-400" />
				</label>
			</div>
		</div>
	)
}
export default GenderCheckbox