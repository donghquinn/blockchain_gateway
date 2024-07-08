export const insertWeb3Network = `
    INSERT INTO network_table
    SET
        network_name = ?,
        rpc_url = ?
`;

export const getWeb3Network = `
    SELECT network_seq, network_name, rpc_url
    FROM network_table
    WHERE network_status = 50
`;
