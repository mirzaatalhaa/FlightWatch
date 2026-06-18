data "aws_ami" "ubuntu" {
  most_recent = true

  owners = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "flightwatch_backend" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  subnet_id = aws_subnet.flightwatch_public_subnet.id

  vpc_security_group_ids = [
    aws_security_group.flightwatch_security_group.id
  ]

  key_name = "flightwatch-key"

  tags = {
    Name = "flightwatch-backend"
  }
}