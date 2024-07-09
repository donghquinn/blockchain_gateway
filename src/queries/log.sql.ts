export const insertTxLogQuery = `
    INSERT INTO transaction_log_table
    SET
        transaction_seq = ?,
        network_seq = ?,
        send_status = ?,
        transaction_obj = ?,
        response = ?
`;

// 최초 트랜잭션 전송 실패 사유
export const insertFailedTxLogQuery = `
    INSERT INTO resend_transaction_table
    SET
        tx_log_seq = ?,
        retry_count = ?
`;

// 전송 실패 시, 이유 업데이트
export const updateFailedTxSendReason = `
    UPDATE resend_transaction_table
    SET
        failed_reason = ?,
        resend_status = ?,
        retry_count = ?
    WHERE
        resend_tx_seq = ?
`;
