resource "aws_ecr_repository" "ttt_backend_repo" {
  name                 = "ttt_backend_repo"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "ttt_frontend_repo" {
  name                 = "ttt_frontend_repo"
  image_tag_mutability = "MUTABLE"
}

output "backend_repo_url" {
  value = aws_ecr_repository.ttt_backend_repo.repository_url
}

output "frontend_repo_url" {
  value = aws_ecr_repository.ttt_frontend_repo.repository_url
}
