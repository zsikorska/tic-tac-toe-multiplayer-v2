resource "aws_db_subnet_group" "ttt_db_subnet_group" {
  name       = "ttt-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}

resource "aws_db_instance" "ttt_db_instance" {
  identifier = "ttt-db-instance"
  db_name    = "ttt_db"

  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.t3.micro"
  storage_type      = "gp2"
  allocated_storage = 10

  username = "postgres"
  password = "password"

  availability_zone      = "us-east-1a"
  vpc_security_group_ids = [aws_security_group.ttt_db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.ttt_db_subnet_group.name
}
