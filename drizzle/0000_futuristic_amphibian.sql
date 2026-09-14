CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ref1` varchar(64) NOT NULL,
	`ref2` varchar(64) NOT NULL,
	`no_resi` varchar(64),
	`product_code` varchar(16) NOT NULL,
	`pdam_name` varchar(100) NOT NULL,
	`customer_id` varchar(32) NOT NULL,
	`customer_name` varchar(150),
	`customer_address` varchar(255),
	`nominal` int NOT NULL,
	`admin_fee` int NOT NULL,
	`penalty` int NOT NULL DEFAULT 0,
	`misc_fee` int NOT NULL DEFAULT 0,
	`meter_usage` int NOT NULL DEFAULT 0,
	`total_amount` int NOT NULL,
	`terbilang` varchar(255),
	`status` varchar(8) NOT NULL,
	`status_description` varchar(150),
	`raw_request` text,
	`raw_response` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_tx_ref2` UNIQUE(`ref2`)
);
CREATE INDEX `idx_tx_customer_id` ON `transactions` (`customer_id`);
CREATE INDEX `idx_tx_ref1` ON `transactions` (`ref1`);
CREATE INDEX `idx_tx_created_at` ON `transactions` (`created_at`);