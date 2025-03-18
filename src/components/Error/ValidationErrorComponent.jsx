import React from "react";
import ErrorComponent from "./ErrorComponent";

/**
 * Component for displaying validation errors
 * @param {Object} props
 * @param {string} props.message - Error message
 * @param {Object} props.errors - Validation errors object where keys are field names and values are error messages
 * @param {function} props.onAction - Callback when the retry button is clicked
 * @returns {React.ReactNode}
 */
export default function ValidationErrorComponent({
  message = "Form doğrulama hatası",
  errors = {},
  onAction,
}) {
  // Format validation errors as a list
  const formatErrorsList = () => {
    if (Object.keys(errors).length === 0) {
      return message;
    }

    const errorList = Object.entries(errors).map(
      ([field, error]) => `${field}: ${error}`
    );

    return (
      <div>
        <p>{message}</p>
        <ul className="list-disc pl-5 mt-2">
          {errorList.map((error, index) => (
            <li key={index} className="text-sm">
              {error}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <ErrorComponent
      message={formatErrorsList()}
      type="validation"
      color="warning"
      actionText="Düzelt"
      onAction={onAction}
    />
  );
}
