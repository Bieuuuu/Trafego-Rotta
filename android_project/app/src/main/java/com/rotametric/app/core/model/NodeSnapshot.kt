package com.rotametric.app.core.model

/**
 * Representação imutável e testável de uma árvore de acessibilidade.
 * Não depende de AccessibilityNodeInfo, permitindo testes unitários puros.
 */
data class NodeSnapshot(
    val text: String?,
    val contentDescription: String?,
    val viewId: String?,
    val className: String?,
    val children: List<NodeSnapshot> = emptyList()
) {
    /** Todos os textos visíveis em ordem de profundidade. */
    fun allTexts(): List<String> {
        val out = mutableListOf<String>()
        fun walk(n: NodeSnapshot) {
            n.text?.takeIf { it.isNotBlank() }?.let { out += it }
            n.contentDescription?.takeIf { it.isNotBlank() }?.let { out += it }
            n.children.forEach(::walk)
        }
        walk(this)
        return out
    }

    fun nodeCount(): Int = 1 + children.sumOf { it.nodeCount() }

    companion object {
        fun leaf(text: String, viewId: String? = null) =
            NodeSnapshot(text = text, contentDescription = null, viewId = viewId, className = "android.widget.TextView")

        fun container(vararg children: NodeSnapshot) =
            NodeSnapshot(text = null, contentDescription = null, viewId = null, className = "android.view.ViewGroup", children = children.toList())
    }
}