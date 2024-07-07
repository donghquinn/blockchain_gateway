export const insertUserInfoQuery = `
    INSERT INTO user_table
    SET
        user_id = ?,
        user_name = ?,
        user_email = ?,
        password = ?
`;

export const getUserLoginInfoQuery = `
    SELECT *
    FROM user_table
    WHERE user_status = 50 
        AND user_email = ?
`;

export const getUserInfoQuery = `
    SELECT u.*, a.address, a.nonce, a.balance, a.account_status
        , a.created AS account_created, a.updated AS account_updated
        , n.network_name, n.network_status
    FROM user_table u
    LEFT JOIN account_table a ON a.user_id = u.user_id
    LEFT JOIN network_table n ON n.network_seq = a.network_seq
    WHERE u.user_status = 50
        AND u.user_email = ?   
`;
