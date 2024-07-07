/* eslint-disable max-len */

export const createUserTable = `
    CREATE TABLE IF NOT EXISTS user_table (
        user_id         VARCHAR(50)     NOT NULL PRIMARY KEY,
        user_email      VARCHAR(200)    NOT NULL UNQIUE,
        user_name       VARCHAR(50)     NOT NULL,
        password        VARCHAR(200)    NOT NULL,
        is_manager      BOOLEAN         NOT NULL DEFAULT FALSE,
        user_status     TINYINT(2)      NOT NULL DEFAULT 50 COMMNET '50 - 유저 어카운트, 10 - 유저 어카운트',
        created         DATETIME        NOT NULL DEFAULT current_timestamp,
        updated         DATETIME        NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,

        INDEX user_idx(user_status)
    )
`;

export const createNeworkTable = `
    CREATE TABLE IF NOT EXISTS network_table (
        network_seq     INT(20)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
        network_name    VARCHAR(50)     NOT NULL,
        rpc_url         TEXT            NOT NULL,
        network_status  TINYINT(2)      NOT NULL DEFAULT 50 COMMENT '10 - 비활성 네트워크, 50 - 활성 네트워크',
        created         DATETIME        NOT NULL DEFAULT current_timestamp,
        updated         DATETIME        NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,

        INDEX network_idx(network_status)
    )
`;

export const createAccountTable = `
    CREATE TABLE IF NOT EXISTS account_table (
        account_seq     INT(20)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id         VARCHAR(50)     NOT NULL,
        network_seq     INT(20)         NOT NULL,
        address         VARCHAR(100)    NOT NULL,
        nonce           BIGINT          NOT NULL,
        balance         BIGINT          NOT NULL,
        account_status  TINYINT(2)      NOT NULL DEFAULT 50 COMMNET '50 - 활성 어카운트, 10 - 비활성 어카운트',
        created         DATETIME        NOT NULL DEFAULT current_timestamp,
        updated         DATETIME        NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,

        INDEX account_idx(account_status, network_seq, user_id)
    )
`;

export const createTransactionTable = `
    CREATE TABLE IF NOT EXISTS transaction_table (
        transaction_seq     INT(20)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
        account_seq         INT(20)         NOT NULL,
        used_gas            BIGINT          NOT NULL,
        value               BIGINT          NOT NULL,
        tx_id               VARCHAR(300)    NOT NULL,
        tx_status           TINYINT(2)      NOT NULL DEFAULT 10 COMMENT '10 - 생성 완료, 20 - 서명 완료, 30 - pending, 50 - 전송 완료',
        created             DATETIME        NOT NULL DEFAULT current_timestamp,
        updated             DATETIME        NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,

        INDEX tx_idx(account_seq, tx_id, tx_status)
    )
`;
