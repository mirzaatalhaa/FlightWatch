resource "aws_db_subnet_group" "flightwatch_db_subnet_group" {
  name = "flightwatch-db-subnet-group"

  subnet_ids = [
    aws_subnet.flightwatch_private_subnet_1.id,
    aws_subnet.flightwatch_private_subnet_2.id
  ]

  tags = {
    Name = "flightwatch-db-subnet-group"
  }
}

resource "aws_security_group" "flightwatch_rds_sg" {
  name        = "flightwatch-rds-sg"
  description = "Security group for PostgreSQL"
  vpc_id      = aws_vpc.flightwatch_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.flightwatch_security_group.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "flightwatch-rds-sg"
  }
}

resource "aws_db_instance" "flightwatch_db" {
  identifier = "flightwatch-db"

  engine         = "postgres"
  engine_version = "15"

  instance_class = "db.t3.micro"

  allocated_storage = 20
  storage_type      = "gp3"

  db_name  = "flightwatch"
  username = "postgres"
  password = "ChangeThisLater123!"

  publicly_accessible = false

  db_subnet_group_name   = aws_db_subnet_group.flightwatch_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.flightwatch_rds_sg.id]

  skip_final_snapshot = true
  deletion_protection = false

  backup_retention_period = 1

  tags = {
    Name = "flightwatch-db"
  }
}